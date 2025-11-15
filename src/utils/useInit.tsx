import { invoke } from "@tauri-apps/api";
import { useEffect, useState, useCallback } from "react";
import { KeyPair, Session } from "shirokuma";

declare global {
    interface Window {
        HTTP_PORT: number;
        NODE_ADDRESS: string;
        BLOBS_PATH: string;
        GRAPHQL_ENDPOINT: string;
        session: any; // Keep as 'any' for backward compatibility
        LATEST_SPRITE: any;
    }
}

interface InitState {
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    session: Session | null;
    httpPort: number | null;
}

interface AppConfig {
    httpPort: number;
    nodeAddress: string;
    blobsPath: string;
    graphqlEndpoint: string;
}

const LOCAL_STORAGE_KEY = 'privateKey';

export const useInit = (): InitState => {
    const [state, setState] = useState<InitState>({
        isLoading: true,
        isInitialized: false,
        error: null,
        session: null,
        httpPort: null,
    });

    const createOrRetrieveKeyPair = useCallback((): KeyPair => {
        try {
            const privateKey = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (privateKey) {
                return new KeyPair(privateKey);
            }

            const keyPair = new KeyPair();
            localStorage.setItem(LOCAL_STORAGE_KEY, keyPair.privateKey());
            return keyPair;
        } catch (error) {
            throw new Error(`Failed to create or retrieve key pair: ${error}`);
        }
    }, []);

    const setupAppConfig = useCallback(async (): Promise<AppConfig> => {
        try {
            const httpPort = await invoke<number>('http_port_command');
            const nodeAddress = `http://localhost:${httpPort}/`;
            const blobsPath = `${nodeAddress}blobs/`;
            const graphqlEndpoint = `${nodeAddress}graphql`;

            return {
                httpPort,
                nodeAddress,
                blobsPath,
                graphqlEndpoint,
            };
        } catch (error) {
            throw new Error(`Failed to setup app configuration: ${error}`);
        }
    }, []);

    const initializeApp = useCallback(async (): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Setup configuration
            const config = await setupAppConfig();

            // Create or retrieve key pair
            const keyPair = createOrRetrieveKeyPair();

            // Create session
            const session = new Session(config.graphqlEndpoint).setKeyPair(keyPair);

            // Set global window properties (for backward compatibility)
            window.HTTP_PORT = config.httpPort;
            window.NODE_ADDRESS = config.nodeAddress;
            window.BLOBS_PATH = config.blobsPath;
            window.GRAPHQL_ENDPOINT = config.graphqlEndpoint;
            window.session = session;

            setState({
                isLoading: false,
                isInitialized: true,
                error: null,
                session,
                httpPort: config.httpPort,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
        }
    }, [setupAppConfig, createOrRetrieveKeyPair]);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    return state;
};