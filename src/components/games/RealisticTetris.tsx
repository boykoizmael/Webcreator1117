import React, { useState, useEffect, useRef, useCallback } from 'react';
import { updateLeaderboardScore } from '../../utils/accountManager';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Flame, 
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

interface RealisticTetrisProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 28;

type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

interface Tetromino {
  shape: number[][];
  color: string;
  lightColor: string;
  darkColor: string;
  type: TetrominoType;
}

const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#06b6d4', // Cyan
    lightColor: '#67e8f9',
    darkColor: '#0891b2',
    type: 'I'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#3b82f6', // Blue
    lightColor: '#93c5fd',
    darkColor: '#1d4ed8',
    type: 'J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f97316', // Orange
    lightColor: '#fdba74',
    darkColor: '#c2410c',
    type: 'L'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#eab308', // Yellow
    lightColor: '#fef08a',
    darkColor: '#a16207',
    type: 'O'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#22c55e', // Green
    lightColor: '#86efac',
    darkColor: '#15803d',
    type: 'S'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a855f7', // Purple
    lightColor: '#d8b4fe',
    darkColor: '#7e22ce',
    type: 'T'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#ef4444', // Red
    lightColor: '#fca5a5',
    darkColor: '#b91c1c',
    type: 'Z'
  }
};

const TYPES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export const RealisticTetris: React.FC<RealisticTetrisProps> = ({
  isFullscreen,
  onToggleFullscreen
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const holdCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('tetris_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context for realistic synth sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'move' | 'rotate' | 'drop' | 'clear' | 'tetris' | 'gameover') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'move') {
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'rotate') {
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'drop') {
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'clear') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'tetris') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.07);
        osc.frequency.setValueAtTime(783.99, now + 0.14);
        osc.frequency.setValueAtTime(1046.50, now + 0.21); // C6
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.5);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Ignore audio initialization restrictions
    }
  }, [soundEnabled]);

  // Game Grid State: ROWS x COLS grid storing cell color or null
  const gridRef = useRef<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  const currentPieceRef = useRef<{
    type: TetrominoType;
    shape: number[][];
    x: number;
    y: number;
  } | null>(null);

  const nextPieceRef = useRef<TetrominoType>('T');
  const holdPieceRef = useRef<TetrominoType | null>(null);
  const canHoldRef = useRef(true);

  // Bag of pieces (Random Generator 7-bag system)
  const bagRef = useRef<TetrominoType[]>([]);

  const getRandomPiece = useCallback((): TetrominoType => {
    if (bagRef.current.length === 0) {
      bagRef.current = [...TYPES].sort(() => Math.random() - 0.5);
    }
    return bagRef.current.pop() || 'I';
  }, []);

  // Check collision
  const checkCollision = useCallback((shape: number[][], offsetX: number, offsetY: number) => {
    const grid = gridRef.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = offsetX + c;
          const newY = offsetY + r;

          if (newX < 0 || newX >= COLS || newY >= ROWS) {
            return true;
          }
          if (newY >= 0 && grid[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotate matrix clockwise
  const rotateMatrix = (matrix: number[][]) => {
    const N = matrix.length;
    const result = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        result[c][N - 1 - r] = matrix[r][c];
      }
    }
    return result;
  };

  // Draw realistic 3D beveled block on canvas
  const drawBlock = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    color: string,
    isGhost = false
  ) => {
    if (isGhost) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
      ctx.fillStyle = color + '22';
      ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      return;
    }

    // Base fill
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);

    // Bevel highlights (Top & Left)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size - 3, y + 3);
    ctx.lineTo(x + 3, y + 3);
    ctx.lineTo(x + 3, y + size - 3);
    ctx.lineTo(x, y + size);
    ctx.closePath();
    ctx.fill();

    // Bevel shadows (Bottom & Right)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + 3, y + size - 3);
    ctx.lineTo(x + size - 3, y + size - 3);
    ctx.lineTo(x + size - 3, y + 3);
    ctx.closePath();
    ctx.fill();

    // Center jewel shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
  };

  // Render Mini Canvas for Hold / Next
  const renderMiniCanvas = (canvas: HTMLCanvasElement | null, type: TetrominoType | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!type) return;

    const piece = TETROMINOES[type];
    const shape = piece.shape;
    const miniSize = 20;
    const startX = (canvas.width - shape[0].length * miniSize) / 2;
    const startY = (canvas.height - shape.length * miniSize) / 2;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          drawBlock(ctx, startX + c * miniSize, startY + r * miniSize, miniSize, piece.color);
        }
      }
    }
  };

  // Render main game grid
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark sleek background with grid lines
    ctx.fillStyle = '#0f1118';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = '#1a1f2c';
    ctx.lineWidth = 1;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    // Render placed blocks
    const grid = gridRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c]) {
          drawBlock(ctx, c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, grid[r][c]!);
        }
      }
    }

    // Render Ghost Piece & Active Piece
    const piece = currentPieceRef.current;
    if (piece) {
      const tet = TETROMINOES[piece.type];

      // Calculate ghost Y
      let ghostY = piece.y;
      while (!checkCollision(piece.shape, piece.x, ghostY + 1)) {
        ghostY++;
      }

      // Draw Ghost Piece
      if (ghostY !== piece.y) {
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
              drawBlock(
                ctx, 
                (piece.x + c) * BLOCK_SIZE, 
                (ghostY + r) * BLOCK_SIZE, 
                BLOCK_SIZE, 
                tet.color, 
                true
              );
            }
          }
        }
      }

      // Draw Active Piece
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            drawBlock(
              ctx, 
              (piece.x + c) * BLOCK_SIZE, 
              (piece.y + r) * BLOCK_SIZE, 
              BLOCK_SIZE, 
              tet.color
            );
          }
        }
      }
    }
  }, [checkCollision]);

  // Lock current piece and check lines
  const lockPiece = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece) return;

    const grid = gridRef.current;
    const tet = TETROMINOES[piece.type];

    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const boardY = piece.y + r;
          const boardX = piece.x + c;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            grid[boardY][boardX] = tet.color;
          }
        }
      }
    }

    // Check full lines
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r].every(cell => cell !== null)) {
        grid.splice(r, 1);
        grid.unshift(Array(COLS).fill(null));
        linesCleared++;
        r++; // Recheck same row index after shift
      }
    }

    if (linesCleared > 0) {
      if (linesCleared === 4) {
        playSound('tetris');
      } else {
        playSound('clear');
      }

      const points = [0, 100, 300, 500, 800][linesCleared] * level;
      setScore(prev => {
        const next = prev + points;
        if (next > highScore) {
          setHighScore(next);
          try {
            localStorage.setItem('tetris_high_score', next.toString());
            updateLeaderboardScore('tetrisHighScore', next);
          } catch {}
        }
        return next;
      });

      setLines(prev => {
        const newLines = prev + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        if (newLevel !== level) {
          setLevel(newLevel);
        }
        return newLines;
      });
    } else {
      playSound('drop');
    }

    // Spawn next piece
    const nextType = nextPieceRef.current;
    const shape = TETROMINOES[nextType].shape;
    const startX = Math.floor((COLS - shape[0].length) / 2);
    const startY = 0;

    if (checkCollision(shape, startX, startY)) {
      setIsGameOver(true);
      playSound('gameover');
      currentPieceRef.current = null;
      return;
    }

    currentPieceRef.current = {
      type: nextType,
      shape,
      x: startX,
      y: startY
    };

    nextPieceRef.current = getRandomPiece();
    canHoldRef.current = true;

    renderMiniCanvas(nextCanvasRef.current, nextPieceRef.current);
    renderMiniCanvas(holdCanvasRef.current, holdPieceRef.current);
    render();
  }, [checkCollision, getRandomPiece, highScore, level, playSound, render]);

  // Spawn initial piece
  const resetGame = useCallback(() => {
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    bagRef.current = [];
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsGameOver(false);
    setIsPaused(false);
    holdPieceRef.current = null;
    canHoldRef.current = true;

    const firstType = getRandomPiece();
    const nextType = getRandomPiece();

    nextPieceRef.current = nextType;
    const shape = TETROMINOES[firstType].shape;

    currentPieceRef.current = {
      type: firstType,
      shape,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0
    };

    renderMiniCanvas(nextCanvasRef.current, nextPieceRef.current);
    renderMiniCanvas(holdCanvasRef.current, holdPieceRef.current);
    render();
  }, [getRandomPiece, render]);

  // Hold Piece
  const handleHold = useCallback(() => {
    if (!canHoldRef.current || isGameOver || isPaused) return;

    const current = currentPieceRef.current;
    if (!current) return;

    playSound('rotate');
    const prevHold = holdPieceRef.current;
    holdPieceRef.current = current.type;

    if (prevHold) {
      const shape = TETROMINOES[prevHold].shape;
      currentPieceRef.current = {
        type: prevHold,
        shape,
        x: Math.floor((COLS - shape[0].length) / 2),
        y: 0
      };
    } else {
      const nextType = nextPieceRef.current;
      const shape = TETROMINOES[nextType].shape;
      currentPieceRef.current = {
        type: nextType,
        shape,
        x: Math.floor((COLS - shape[0].length) / 2),
        y: 0
      };
      nextPieceRef.current = getRandomPiece();
      renderMiniCanvas(nextCanvasRef.current, nextPieceRef.current);
    }

    canHoldRef.current = false;
    renderMiniCanvas(holdCanvasRef.current, holdPieceRef.current);
    render();
  }, [getRandomPiece, isGameOver, isPaused, playSound, render]);

  // Movement & Rotation Controls
  const move = useCallback((dir: -1 | 1) => {
    if (isGameOver || isPaused || !currentPieceRef.current) return;
    const p = currentPieceRef.current;
    if (!checkCollision(p.shape, p.x + dir, p.y)) {
      p.x += dir;
      playSound('move');
      render();
    }
  }, [checkCollision, isGameOver, isPaused, playSound, render]);

  const rotate = useCallback(() => {
    if (isGameOver || isPaused || !currentPieceRef.current) return;
    const p = currentPieceRef.current;
    const rotated = rotateMatrix(p.shape);

    // Standard wall kick attempt
    if (!checkCollision(rotated, p.x, p.y)) {
      p.shape = rotated;
      playSound('rotate');
      render();
    } else if (!checkCollision(rotated, p.x - 1, p.y)) {
      p.shape = rotated;
      p.x -= 1;
      playSound('rotate');
      render();
    } else if (!checkCollision(rotated, p.x + 1, p.y)) {
      p.shape = rotated;
      p.x += 1;
      playSound('rotate');
      render();
    }
  }, [checkCollision, isGameOver, isPaused, playSound, render]);

  const drop = useCallback(() => {
    if (isGameOver || isPaused || !currentPieceRef.current) return;
    const p = currentPieceRef.current;
    if (!checkCollision(p.shape, p.x, p.y + 1)) {
      p.y += 1;
      render();
    } else {
      lockPiece();
    }
  }, [checkCollision, isGameOver, isPaused, lockPiece, render]);

  const hardDrop = useCallback(() => {
    if (isGameOver || isPaused || !currentPieceRef.current) return;
    const p = currentPieceRef.current;
    let droppedDistance = 0;
    while (!checkCollision(p.shape, p.x, p.y + 1)) {
      p.y += 1;
      droppedDistance++;
    }
    setScore(prev => prev + droppedDistance * 2);
    lockPiece();
  }, [checkCollision, isGameOver, isPaused, lockPiece]);

  // Game loop tick based on current level
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const speed = Math.max(100, 800 - (level - 1) * 70);
    const timer = setInterval(() => {
      drop();
    }, speed);

    return () => clearInterval(timer);
  }, [drop, isGameOver, isPaused, level]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowUp' || e.key === 'x' || e.key === 'X') rotate();
      else if (e.key === 'ArrowDown') drop();
      else if (e.key === ' ') hardDrop();
      else if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') handleHold();
      else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') setIsPaused(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drop, handleHold, hardDrop, move, rotate]);

  // Mount setup
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="w-full flex flex-col h-full space-y-3 select-none">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">Tetris Realistic</span>
            <span className="text-gray-400 text-[11px] ml-1.5 hidden sm:inline">
              Physics blocks, ghost projection & SRS rotation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-300 hover:text-white rounded-lg border border-[#2d364c] cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-2.5 py-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-200 rounded-lg border border-[#2d364c] font-semibold flex items-center gap-1 cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={resetGame}
            className="px-2.5 py-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-200 rounded-lg border border-[#2d364c] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div className={`relative w-full bg-[#0a0c12] p-4 flex items-center justify-center overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-0' : 'aspect-video min-h-[520px] lg:min-h-[640px] rounded-2xl border-2 border-[#202738]'}`}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-4xl w-full">
          
          {/* Left Panel: Hold Piece & Stats */}
          <div className="flex md:flex-col gap-3 w-full md:w-40 justify-center">
            {/* Hold Box */}
            <div className="bg-[#121520] border border-[#232a3d] rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                HOLD (Shift / C)
              </span>
              <canvas 
                ref={holdCanvasRef} 
                width={80} 
                height={80} 
                className="bg-[#0b0d14] rounded-lg border border-[#1a1f2e]"
              />
            </div>

            {/* Level & Lines */}
            <div className="bg-[#121520] border border-[#232a3d] rounded-xl p-3 space-y-2 flex-1 md:flex-none">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Level</div>
                <div className="text-xl font-black text-cyan-300">{level}</div>
              </div>
              <div className="pt-2 border-t border-[#1c2233]">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lines</div>
                <div className="text-xl font-black text-emerald-400">{lines}</div>
              </div>
            </div>
          </div>

          {/* Center: Main Canvas Stage */}
          <div className="relative border-4 border-[#2d364d] rounded-xl overflow-hidden shadow-2xl shadow-cyan-950/40 bg-black">
            <canvas 
              ref={canvasRef} 
              width={COLS * BLOCK_SIZE} 
              height={ROWS * BLOCK_SIZE} 
              className="block"
            />

            {/* Game Over Screen */}
            {isGameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <span className="text-2xl font-black text-red-500 tracking-wider mb-1">GAME OVER</span>
                <p className="text-xs text-gray-400 mb-4">You cleared {lines} lines!</p>
                <div className="bg-[#141724] border border-[#293248] rounded-xl p-3 mb-4 w-full max-w-[200px]">
                  <div className="text-[10px] text-gray-400">Final Score</div>
                  <div className="text-xl font-black text-amber-400">{score}</div>
                </div>
                <button
                  onClick={resetGame}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-90 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            )}

            {/* Paused Screen */}
            {isPaused && !isGameOver && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <span className="text-2xl font-black text-white tracking-wider mb-2">PAUSED</span>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume Game</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: Next Piece & Score */}
          <div className="flex md:flex-col gap-3 w-full md:w-40 justify-center">
            {/* Next Piece Box */}
            <div className="bg-[#121520] border border-[#232a3d] rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                NEXT PIECE
              </span>
              <canvas 
                ref={nextCanvasRef} 
                width={80} 
                height={80} 
                className="bg-[#0b0d14] rounded-lg border border-[#1a1f2e]"
              />
            </div>

            {/* Score & High Score */}
            <div className="bg-[#121520] border border-[#232a3d] rounded-xl p-3 space-y-2 flex-1 md:flex-none">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</div>
                <div className="text-xl font-black text-amber-400">{score}</div>
              </div>
              <div className="pt-2 border-t border-[#1c2233]">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>High Score</span>
                </div>
                <div className="text-lg font-black text-yellow-300">{highScore}</div>
              </div>
            </div>
          </div>
        </div>

        {/* On-screen touch/mobile controls */}
        <div className="absolute bottom-2 left-4 right-4 flex md:hidden items-center justify-between pointer-events-auto">
          <div className="flex gap-1.5">
            <button onClick={() => move(-1)} className="p-3 bg-white/10 rounded-xl active:bg-white/25"><ArrowLeft className="w-5 h-5 text-white" /></button>
            <button onClick={() => move(1)} className="p-3 bg-white/10 rounded-xl active:bg-white/25"><ArrowRight className="w-5 h-5 text-white" /></button>
            <button onClick={drop} className="p-3 bg-white/10 rounded-xl active:bg-white/25"><ArrowDown className="w-5 h-5 text-white" /></button>
          </div>
          <div className="flex gap-1.5">
            <button onClick={rotate} className="p-3 bg-cyan-600/80 rounded-xl active:bg-cyan-500 font-bold text-white text-xs">Rotate</button>
            <button onClick={hardDrop} className="p-3 bg-amber-600/80 rounded-xl active:bg-amber-500 font-bold text-white text-xs">Drop</button>
          </div>
        </div>
      </div>
    </div>
  );
};
