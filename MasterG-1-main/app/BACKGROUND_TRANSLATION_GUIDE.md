# Background Translation Setup Guide

## Problem
When navigating from Stitch to Chat, the translation stops and the page reloads, losing all progress.

## Solution
Implement **global state management** with **background translation** that persists across navigation.

## What I Created

### 1. Translation Context (`contexts/TranslationContext.tsx`)
- Global state for all translation jobs
- Translations run in background
- Persists across navigation
- Tracks progress, status, and results

### 2. Translation Progress Component (`components/TranslationProgress.tsx`)
- Floating notification showing translation progress
- Visible on all screens
- Shows percentage complete
- Can be dismissed

## How to Integrate

### Step 1: Wrap App with Translation Provider

Edit `app/_layout.tsx`:

```typescript
import { TranslationProvider } from '@/contexts/TranslationContext';

export default function RootLayout() {
  return (
    <TranslationProvider>
      {/* Your existing layout */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TranslationProvider>
  );
}
```

### Step 2: Add Progress Indicator to Layout

Edit `app/(tabs)/_layout.tsx`:

```typescript
import { TranslationProgress } from '@/components/TranslationProgress';

export default function TabLayout() {
  return (
    <>
      <Tabs>
        {/* Your existing tabs */}
      </Tabs>
      
      {/* Floating translation progress */}
      <TranslationProgress />
    </>
  );
}
```

### Step 3: Update Stitch Screen to Use Context

Edit `app/(tabs)/learn.tsx`:

```typescript
import { useTranslationContext } from '@/contexts/TranslationContext';

export default function LearnScreen() {
  const { startTranslation, getJob } = useTranslationContext();
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Replace handleTranslate function
  const handleTranslate = useCallback(async (targetLanguage: string) => {
    if (!originalContent) return;

    const langInfo = TRANSLATION_LANGUAGES.find(l => l.code === targetLanguage);
    
    // Start background translation
    const jobId = startTranslation({
      text: originalContent,
      sourceLanguage: 'english',
      targetLanguage: targetLanguage,
      targetLanguageName: langInfo?.native || targetLanguage,
      context: 'educational',
      onComplete: (result) => {
        // Update UI when translation completes
        setDisplayContent(result.translatedText);
        setIsTranslated(true);
        setTranslatedLanguage(langInfo?.native || targetLanguage);
        setTranslationTime((Date.now() - result.processingTime) / 1000);
      },
      onError: (error) => {
        Alert.alert('Translation Error', error);
      },
    });

    setCurrentJobId(jobId);
    setShowLanguagePicker(false);
  }, [originalContent, startTranslation]);

  return (
    // Your existing UI
  );
}
```

## How It Works

### Before (Current Behavior)
```
User on Stitch Screen
  ↓
Starts Translation
  ↓
Navigates to Chat
  ↓
❌ Component unmounts
❌ Translation stops
❌ State lost
```

### After (New Behavior)
```
User on Stitch Screen
  ↓
Starts Translation (stored in global context)
  ↓
Translation runs in background
  ↓
User navigates to Chat
  ↓
✅ Translation continues
✅ Progress shown in floating notification
✅ Can navigate back to see result
  ↓
Translation completes
  ↓
✅ Result stored in context
✅ Callback updates UI if on Stitch screen
✅ Notification shows completion
```

## Features

### 1. Background Translation
- Translations run independently of UI
- Continue even when navigating away
- Multiple translations can queue

### 2. Progress Tracking
- Real-time progress updates (0-100%)
- Shows target language
- Displays time elapsed

### 3. Persistent State
- Translation results stored globally
- Can access from any screen
- Survives navigation

### 4. User Experience
- Floating notification (non-intrusive)
- Can dismiss notification
- Auto-hides when complete
- Shows errors if translation fails

## Advanced Usage

### Check Translation Status from Any Screen

```typescript
import { useTranslationContext } from '@/contexts/TranslationContext';

function AnyScreen() {
  const { jobs, getJob } = useTranslationContext();
  
  // Get all active translations
  const activeTranslations = jobs.filter(j => j.status === 'translating');
  
  // Get specific job
  const job = getJob('job_id_here');
  
  // Check if translation is complete
  if (job?.status === 'completed') {
    const result = job.result;
    // Use translation result
  }
}
```

### Clear Completed Jobs

```typescript
const { clearJob, clearAllJobs } = useTranslationContext();

// Clear specific job
clearJob('job_id');

// Clear all jobs
clearAllJobs();
```

## Benefits

✅ **Non-blocking**: UI remains responsive during translation
✅ **Persistent**: State survives navigation
✅ **Parallel**: Multiple translations can run
✅ **Visible**: Progress shown everywhere
✅ **Reliable**: Errors handled gracefully

## Testing

1. Start a translation on Stitch screen
2. Navigate to Chat screen
3. ✅ Translation continues (see floating notification)
4. Navigate back to Stitch
5. ✅ Result appears when complete

## Summary

The solution uses **React Context** for global state management, allowing translations to run in the background independently of any specific screen. The floating progress indicator keeps users informed across all screens.

**Key Files:**
- `contexts/TranslationContext.tsx` - Global state
- `components/TranslationProgress.tsx` - Progress UI
- Integration in `_layout.tsx` files

This is a common pattern in React Native apps for handling long-running operations that should persist across navigation!
