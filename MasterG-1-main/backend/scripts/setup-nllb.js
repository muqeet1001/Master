/**
 * Automatic NLLB Setup Script
 * 
 * This script runs before the backend starts and ensures NLLB dependencies are installed.
 * It checks if Python packages are installed and installs them if missing.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROXY_DIR = path.join(__dirname, '..', 'proxy');
const VENV_DIR = path.join(PROXY_DIR, 'venv');
const REQUIREMENTS_FILE = path.join(PROXY_DIR, 'requirements.txt');

// Check if running on Windows
const isWindows = process.platform === 'win32';
const pythonExe = isWindows
    ? path.join(VENV_DIR, 'Scripts', 'python.exe')
    : path.join(VENV_DIR, 'bin', 'python');

const pipExe = isWindows
    ? path.join(VENV_DIR, 'Scripts', 'pip.exe')
    : path.join(VENV_DIR, 'bin', 'pip');

console.log('\n🔍 Checking NLLB setup...\n');

// Check if virtual environment exists
if (!fs.existsSync(VENV_DIR)) {
    console.log('❌ Virtual environment not found');
    console.log('📦 Creating virtual environment...\n');

    try {
        execSync('python -m venv venv', {
            cwd: PROXY_DIR,
            stdio: 'inherit'
        });
        console.log('✅ Virtual environment created\n');
    } catch (error) {
        console.error('❌ Failed to create virtual environment');
        console.error('Please run: cd proxy && python -m venv venv');
        process.exit(0); // Don't fail, just warn
    }
}

// Check if Python packages are installed
console.log('🔍 Checking Python dependencies...\n');

let needsInstall = false;

try {
    // Try to import torch
    execSync(`"${pythonExe}" -c "import torch"`, {
        stdio: 'pipe',
        cwd: PROXY_DIR
    });
    console.log('✅ PyTorch installed');
} catch (error) {
    console.log('❌ PyTorch not installed');
    needsInstall = true;
}

try {
    // Try to import transformers
    execSync(`"${pythonExe}" -c "import transformers"`, {
        stdio: 'pipe',
        cwd: PROXY_DIR
    });
    console.log('✅ Transformers installed');
} catch (error) {
    console.log('❌ Transformers not installed');
    needsInstall = true;
}

if (needsInstall) {
    console.log('\n📦 Installing Python dependencies...');
    console.log('⏳ This may take 5-10 minutes (first time only)\n');

    try {
        // Upgrade pip first
        console.log('Upgrading pip...');
        execSync(`"${pythonExe}" -m pip install --upgrade pip`, {
            cwd: PROXY_DIR,
            stdio: 'inherit'
        });

        // Install requirements
        console.log('\nInstalling packages from requirements.txt...');
        execSync(`"${pipExe}" install -r requirements.txt`, {
            cwd: PROXY_DIR,
            stdio: 'inherit'
        });

        console.log('\n✅ Python dependencies installed successfully!\n');
    } catch (error) {
        console.error('\n❌ Failed to install Python dependencies');
        console.error('\nManual installation:');
        console.error('  cd proxy');
        console.error('  venv\\Scripts\\activate  (Windows)');
        console.error('  pip install -r requirements.txt');
        console.error('\nBackend will start, but NLLB translation will not work.\n');
        process.exit(0); // Don't fail, just warn
    }
} else {
    console.log('\n✅ All Python dependencies installed\n');
}

// Check if model is downloaded
const MODEL_DIR = path.join(PROXY_DIR, 'models', 'nllb-200-distilled-600M');
const MODEL_CONFIG = path.join(MODEL_DIR, 'config.json');

if (!fs.existsSync(MODEL_CONFIG)) {
    console.log('⚠️  NLLB model not downloaded');
    console.log('\nTo download the model (~2.4GB):');
    console.log('  cd proxy');
    console.log('  venv\\Scripts\\activate  (Windows)');
    console.log('  python setup_models.py');
    console.log('\nBackend will start, but NLLB translation will not work until model is downloaded.\n');
} else {
    console.log('✅ NLLB model found\n');
}

console.log('🚀 Starting backend server...\n');
