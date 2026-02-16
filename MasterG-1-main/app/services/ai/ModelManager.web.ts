
/**
 * EduLite Mobile AI - Model Manager (Web Version)
 * Dictionary/Mock implementation for Web where native Llama/File System is not available.
 */

import { ModelConfig, ModelStatus, ModelType } from "../../types/ai.types";
import MemoryManager from "./MemoryManager";

// Mock context type
type LlamaContextType = any;
type ExtendedModelType = ModelType | "translation";

class ModelManager {
    private static instance: ModelManager;
    private isInitialized: boolean = false;

    private constructor() {
        console.log("⚠️ ModelManager running in Web mode (AI models disabled)");
    }

    static getInstance(): ModelManager {
        if (!ModelManager.instance) {
            ModelManager.instance = new ModelManager();
        }
        return ModelManager.instance;
    }

    async verifyModels(): Promise<{
        text: boolean;
        translation: boolean;
    }> {
        return {
            text: false,
            translation: false,
        };
    }

    async initializeTextModel(
        onProgress?: (progress: number) => void
    ): Promise<boolean> {
        console.warn("⚠️ Text model not supported on web");
        return false;
    }

    async initializeTranslationModel(
        onProgress?: (progress: number) => void
    ): Promise<boolean> {
        console.warn("⚠️ Translation model not supported on web");
        return false;
    }

    async initializeAllModels(
        onProgress?: (modelType: ModelType, progress: number) => void
    ): Promise<boolean> {
        console.warn("⚠️ AI models are not supported on web platform");
        return false;
    }

    getTextModel(): LlamaContextType | undefined {
        return undefined;
    }

    getTranslationModel(): LlamaContextType | undefined {
        return undefined;
    }

    getModelStatus(modelType: ExtendedModelType): ModelStatus | undefined {
        return {
            isLoaded: false,
            isLoading: false,
            error: "Not supported on web",
            loadProgress: 0,
            memoryUsage: 0,
        };
    }

    isReady(): boolean {
        return false;
    }

    isTextModelReady(): boolean {
        return false;
    }

    isTranslationModelReady(): boolean {
        return false;
    }

    isVisionReady(): boolean {
        return false;
    }

    getVisionModel(): undefined {
        return undefined;
    }

    async releaseModel(modelType: ExtendedModelType): Promise<void> {
        // No-op
    }

    async releaseAllModels(): Promise<void> {
        // No-op
    }

    getDebugInfo(): string {
        return "AI Models are not supported on the web platform.";
    }
}

export default ModelManager;
