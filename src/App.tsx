import { useState, useEffect } from 'react';
import type { AppScreen, Recipe, RecipeItem } from './types/recipe';
import { storageService } from './services/storageService';
import { Header } from './components/common/Header';
import { HomeScreen } from './components/home/HomeScreen';
import { StepDishTitle } from './components/recipe-creation/StepDishTitle';
import { StepIngredientsAndSteps } from './components/recipe-creation/StepIngredientsAndSteps';
import { StepGrandpaReview } from './components/recipe-creation/StepGrandpaReview';
import { RecipeBook } from './components/recipe-book/RecipeBook';
import { usePWAInstall } from './hooks/usePWAInstall';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Current active recipe creation state
  const [activeTitle, setActiveTitle] = useState('');
  const [activeItems, setActiveItems] = useState<RecipeItem[]>([]);

  // PWA install support
  const { canInstall, installApp } = usePWAInstall();

  // Load recipes on mount & sync with Supabase if configured
  useEffect(() => {
    const loaded = storageService.getRecipes();
    setRecipes(loaded);

    // Background sync with cloud
    storageService.syncWithCloud().then((cloudRecipes) => {
      if (cloudRecipes && cloudRecipes.length > 0) {
        setRecipes(cloudRecipes);
      }
    });
  }, []);

  const handleStartNewRecipe = () => {
    setActiveTitle('');
    setActiveItems([]);
    setCurrentScreen('create-title');
  };

  const handleTitleConfirmed = (dishTitle: string) => {
    setActiveTitle(dishTitle);
    setCurrentScreen('create-items');
  };

  const handleAddItem = (text: string) => {
    const newItem: RecipeItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      text,
      timestamp: Date.now(),
    };
    setActiveItems((prev) => [...prev, newItem]);
  };

  const handleDeleteActiveItem = (id: string) => {
    setActiveItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateActiveItem = (id: string, newText: string) => {
    setActiveItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  const handleFinishRecipe = () => {
    if (activeItems.length === 0) {
      alert('Lütfen en az bir malzeme veya adım ekleyin.');
      return;
    }
    setCurrentScreen('ismet-review');
  };

  const handleSaveRecipeConfirmed = () => {
    const newRecipe: Recipe = {
      id: 'rec-' + Date.now().toString(),
      title: activeTitle,
      items: activeItems,
      createdAt: new Date().toISOString(),
      verifiedByIsmet: true,
      verifiedAt: new Date().toISOString(),
    };

    const updated = storageService.addRecipe(newRecipe);
    setRecipes(updated);
    setActiveTitle('');
    setActiveItems([]);
    setCurrentScreen('recipe-book');
  };

  const handleDeleteSavedRecipe = (id: string) => {
    const updated = storageService.deleteRecipe(id);
    setRecipes(updated);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3] text-[#1f1d1a] flex flex-col font-sans selection:bg-amber-200">
      {/* Top Navigation Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        recipesCount={recipes.length}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-start">
        {currentScreen === 'home' && (
          <HomeScreen
            recipeCount={recipes.length}
            onStartNewRecipe={handleStartNewRecipe}
            onOpenRecipeBook={() => setCurrentScreen('recipe-book')}
            canInstall={canInstall}
            onInstallApp={installApp}
          />
        )}

        {currentScreen === 'create-title' && (
          <StepDishTitle
            initialTitle={activeTitle}
            onNext={handleTitleConfirmed}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'create-items' && (
          <StepIngredientsAndSteps
            dishTitle={activeTitle}
            items={activeItems}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteActiveItem}
            onFinishRecipe={handleFinishRecipe}
            onBackToTitle={() => setCurrentScreen('create-title')}
          />
        )}

        {currentScreen === 'ismet-review' && (
          <StepGrandpaReview
            dishTitle={activeTitle}
            items={activeItems}
            onSaveRecipe={handleSaveRecipeConfirmed}
            onBackToEditing={() => setCurrentScreen('create-items')}
            onUpdateTitle={setActiveTitle}
            onUpdateItem={handleUpdateActiveItem}
            onDeleteItem={handleDeleteActiveItem}
            onAddItem={handleAddItem}
          />
        )}

        {currentScreen === 'recipe-book' && (
          <RecipeBook
            recipes={recipes}
            onStartNewRecipe={handleStartNewRecipe}
            onDeleteRecipe={handleDeleteSavedRecipe}
          />
        )}
      </main>

      {/* Warm Footer */}
      <footer className="py-4 text-center text-sm sm:text-base font-black text-stone-700 border-t-2 border-stone-200 mt-auto">
        ❤️ Anneannemin el emeği, İsmet dedemin göz nuruyla
      </footer>
    </div>
  );
}

export default App;
