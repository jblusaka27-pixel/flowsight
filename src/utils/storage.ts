interface CalculationHistory {
  id: string;
  sellOutHl: number;
  sellInHl: number;
  desiredLos: number;
  currentLos: number;
  timestamp: string;
}

const STORAGE_KEY = 'sightflow_history';
const MAX_HISTORY = 10;

export function saveToHistory(data: Omit<CalculationHistory, 'id' | 'timestamp'>) {
  try {
    const history = getHistory();
    const newEntry: CalculationHistory = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    history.unshift(newEntry);

    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function getHistory(): CalculationHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function deleteHistoryItem(id: string) {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}
