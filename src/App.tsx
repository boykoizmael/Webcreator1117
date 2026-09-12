/**
 * Eaglecraft Web - Minecraft in Browser with Live Multiplayer Servers
 * @license Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { GameViewport } from './components/GameViewport';
import { ServerPanel } from './components/ServerPanel';
import { ControlsModal } from './components/ControlsModal';
import { SchoolBypassModal } from './components/SchoolBypassModal';
import { GreenRiverDecoy } from './components/GreenRiverDecoy';
import { Footer } from './components/Footer';
import { TopCreatorBar } from './components/TopCreatorBar';
import { CreatorContactModal } from './components/CreatorContactModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { CLIENT_MIRRORS, DEFAULT_SERVERS } from './data/servers';
import { ClientMirror, TabCloakPreset } from './types';
import { requestFullscreen, exitFullscreen, isCurrentlyFullscreen } from './utils/gameUtils';
import { getSavedTabCloak, applyTabCloak, triggerPanic } from './utils/stealthUtils';

export default function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeServerUrl, setActiveServerUrl] = useState(DEFAULT_SERVERS[0].url); // 'wss://mc.arch.lol'
  const [activeMirror, setActiveMirror] = useState<ClientMirror>(CLIENT_MIRRORS[0]);
  const [reloadKey, setReloadKey] = useState(1);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isSchoolBypassOpen, setIsSchoolBypassOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactInitialTopic, setContactInitialTopic] = useState('what should we add??');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInitialPlan, setPaymentInitialPlan] = useState<'original' | 'vip' | 'sidekick' | 'nolife'>('vip');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup' | 'reset'>('signup');
  const [bypassModalTab, setBypassModalTab] = useState<'urls' | 'download' | 'aboutblank' | 'cloak' | 'host'>('urls');
  const [currentGameSlide, setCurrentGameSlide] = useState(0);
  const [activeCloak, setActiveCloak] = useState<TabCloakPreset>(() => getSavedTabCloak());
  const [isDecoyActive, setIsDecoyActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      return p.includes('greenriver') || p.includes('1117');
    }
    return false;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Track actual visible time on the site using elapsed wall-clock time.
  useEffect(() => {
    let lastVisibleAt = Date.now();

    const saveElapsedTime = () => {
      if (document.visibilityState !== 'visible') {
        lastVisibleAt = Date.now();
        return;
      }

      const elapsedSeconds = Math.floor((Date.now() - lastVisibleAt) / 1000);
      if (elapsedSeconds > 0) {
        try {
          const storedSeconds = Number(localStorage.getItem('site_visible_seconds_v1') || '0');
          localStorage.setItem('site_visible_seconds_v1', String(storedSeconds + elapsedSeconds));
        } catch {
          // Storage may be unavailable in private browsing.
        }
        lastVisibleAt = Date.now();
      }
    };

    const handleVisibilityChange = () => {
      saveElapsedTime();
      lastVisibleAt = Date.now();
    };

    const timer = window.setInterval(saveElapsedTime, 60 * 60 * 1000);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', saveElapsedTime);

    return () => {
      saveElapsedTime();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', saveElapsedTime);
    };
  }, []);

  // Apply tab cloak on initial mount if saved
  useEffect(() => {
    if (activeCloak.id !== 'default') {
      applyTabCloak(activeCloak);
    }
  }, [activeCloak]);

  // Sync fullscreen state with browser event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(isCurrentlyFullscreen());
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(async () => {
    const nativeFullscreen = isCurrentlyFullscreen();

    try {
      if (nativeFullscreen) {
        await exitFullscreen();
        setIsFullscreen(false);
        return;
      }

      if (isFullscreen) {
        // The browser may reject native fullscreen; this exits the CSS fallback mode.
        setIsFullscreen(false);
        return;
      }

          await requestFullscreen(document.documentElement);
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen request failed or restricted by container:', err);
      // Keep the button useful when native fullscreen is unavailable or blocked.
      setIsFullscreen(true);
    }
  }, [isFullscreen]);

  // Keyboard shortcut listener for F11, Panic Key (\), and Decoy Toggle (Alt+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === '\\' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Panic key: immediate redirect
        const target = e.target as HTMLElement;
        if (target?.tagName !== 'INPUT' && target?.tagName !== 'TEXTAREA') {
          triggerPanic('https://classroom.google.com');
        }
      } else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        // Alt+D: Quick toggle Green River College Decoy view
        e.preventDefault();
        setIsDecoyActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleFullscreen]);

  const handleReload = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleSelectCloak = (preset: TabCloakPreset) => {
    setActiveCloak(preset);
    applyTabCloak(preset);
  };

  // If Decoy Mode is enabled, show the authentic Green River College Canvas LMS view
  const handleOpenBypassModal = (tab: 'urls' | 'download' | 'aboutblank' | 'cloak' | 'host' = 'urls') => {
    setBypassModalTab(tab);
    setIsSchoolBypassOpen(true);
  };

  const handleOpenContactModal = (topic: string = 'what should we add??') => {
    setContactInitialTopic(topic);
    setIsContactModalOpen(true);
  };

  const handleOpenPaymentModal = (plan: 'original' | 'vip' | 'sidekick' | 'nolife' = 'vip') => {
    setPaymentInitialPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleOpenAuthModal = (tab: 'signin' | 'signup' | 'reset' = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  if (isDecoyActive) {
    return (
      <GreenRiverDecoy
        onLaunchGame={() => setIsDecoyActive(false)}
        onExitDecoy={() => setIsDecoyActive(false)}
      />
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed !left-0 !top-0 !z-50 !h-[100vh] !w-[100vw] overflow-auto' : 'min-h-screen'} flex flex-col bg-[#111217] text-[#e2e8f0]`}>
      {/* Top Area: Creator Contact Location & Response Guarantee Banner */}
      {!isFullscreen && (
        <TopCreatorBar 
          onOpenContactModal={handleOpenContactModal} 
          onOpenPaymentModal={handleOpenPaymentModal}
          onOpenAuthModal={handleOpenAuthModal}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        activeServerUrl={activeServerUrl}
        activeMirror={activeMirror}
        onReloadGame={handleReload}
        onOpenControls={() => setIsControlsOpen(true)}
        onOpenSchoolBypass={handleOpenBypassModal}
        onToggleDecoy={() => setIsDecoyActive(true)}
        onOpenContactModal={handleOpenContactModal}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Game Viewport Container with Multi-Game Carousel & Side Arrows */}
        <GameViewport
          containerRef={containerRef}
          iframeRef={iframeRef}
          activeMirror={activeMirror}
          activeServerUrl={activeServerUrl}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          reloadKey={reloadKey}
          onReload={handleReload}
          onSelectMirror={setActiveMirror}
          onOpenSchoolBypass={() => handleOpenBypassModal('urls')}
          onOpenPaymentModal={handleOpenPaymentModal}
          onOpenContactModal={handleOpenContactModal}
          onOpenAuthModal={handleOpenAuthModal}
          onSlideChange={setCurrentGameSlide}
        />

        {/* Server Panel with Primary Working Server URL & Directory */}
        {!isFullscreen && currentGameSlide !== 1 && currentGameSlide !== 2 && currentGameSlide !== 4 && currentGameSlide !== 5 && (
          <ServerPanel
            activeServerUrl={activeServerUrl}
            onSelectActiveServer={setActiveServerUrl}
            onOpenSchoolBypass={() => handleOpenBypassModal('urls')}
          />
        )}
      </main>

      {/* Footer */}
      {!isFullscreen && <Footer onOpenContactModal={handleOpenContactModal} />}

      {/* Controls / Keybinds Modal */}
      <ControlsModal
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
      />

      {/* School Unblock & Stealth Modal */}
      <SchoolBypassModal
        isOpen={isSchoolBypassOpen}
        onClose={() => setIsSchoolBypassOpen(false)}
        activeCloak={activeCloak}
        onSelectCloak={handleSelectCloak}
        activeMirrorUrl={activeMirror.url}
        onToggleDecoy={() => setIsDecoyActive(true)}
        initialTab={bypassModalTab}
      />

      {/* Creator Contact Modal */}
      <CreatorContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialTopic={contactInitialTopic}
      />

      {/* Payment & Rank Modal ($5 Original Link / $10 VIP Link) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        initialPlan={paymentInitialPlan}
        onOpenContactModal={handleOpenContactModal}
      />

      {/* Account System Modal (Sign In / Register / Reset Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
      />
    </div>
  );
}
