import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Chess } from 'chess.js';
import * as THREE from 'three';

interface ChessBoard3DProps {
  chess: Chess;
  onMove: (from: string, to: string) => void;
  playerColor: 'white' | 'black';
  flipped: boolean;
}

interface PieceProps {
  type: string;
  color: 'w' | 'b';
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

function Piece({ type, color, position, onClick, isSelected }: PieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + 0.3 + Math.sin(Date.now() * 0.005) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });

  const pieceColor = color === 'w' ? '#f0f0f0' : '#333333';

  const renderPiece = () => {
    switch (type.toLowerCase()) {
      case 'p':
        return (
          <>
            <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
            <meshStandardMaterial color={pieceColor} />
          </>
        );
      case 'r':
        return (
          <>
            <boxGeometry args={[0.4, 0.7, 0.4]} />
            <meshStandardMaterial color={pieceColor} />
          </>
        );
      case 'n':
        return (
          <>
            <coneGeometry args={[0.3, 0.8, 4]} />
            <meshStandardMaterial color={pieceColor} />
          </>
        );
      case 'b':
        return (
          <>
            <coneGeometry args={[0.25, 0.9, 16]} />
            <meshStandardMaterial color={pieceColor} />
          </>
        );
      case 'q':
        return (
          <>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color={pieceColor} />
          </>
        );
      case 'k':
        return (
          <>
            <cylinderGeometry args={[0.3, 0.35, 1, 8]} />
            <meshStandardMaterial color={pieceColor} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      {renderPiece()}
    </mesh>
  );
}

function Square({ position, isLight, isSelected, isLegalMove, onClick }: any) {
  return (
    <mesh position={position} onClick={onClick} receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial
        color={
          isSelected
            ? '#3b82f6'
            : isLegalMove
            ? '#10b981'
            : isLight
            ? '#d4a574'
            : '#8b6f47'
        }
      />
    </mesh>
  );
}

function Board3DContent({ chess, onMove, playerColor, flipped }: ChessBoard3DProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const board = chess.board();

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      if (legalMoves.includes(square)) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        const moves = chess.moves({ square: square as any, verbose: true });
        if (moves.length > 0) {
          setSelectedSquare(square);
          setLegalMoves(moves.map((m) => m.to));
        } else {
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else {
      const moves = chess.moves({ square: square as any, verbose: true });
      if (moves.length > 0) {
        setSelectedSquare(square);
        setLegalMoves(moves.map((m) => m.to));
      }
    }
  };

  const getSquareName = (rank: number, file: number): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[file]}${8 - rank}`;
  };

  const getPosition = (rank: number, file: number): [number, number, number] => {
    const x = flipped ? 3.5 - file : file - 3.5;
    const z = flipped ? rank - 3.5 : 3.5 - rank;
    return [x, 0, z];
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.3} />

      {board.map((row, rank) =>
        row.map((piece, file) => {
          const square = getSquareName(rank, file);
          const [x, , z] = getPosition(rank, file);
          const isLight = (rank + file) % 2 === 0;
          const isSelected = selectedSquare === square;
          const isLegalMove = legalMoves.includes(square);

          return (
            <group key={square}>
              <Square
                position={[x, 0, z]}
                isLight={isLight}
                isSelected={isSelected}
                isLegalMove={isLegalMove}
                onClick={() => handleSquareClick(square)}
              />
              {piece && (
                <Piece
                  type={piece.type}
                  color={piece.color}
                  position={[x, 0.5, z]}
                  onClick={() => handleSquareClick(square)}
                  isSelected={isSelected}
                />
              )}
            </group>
          );
        })
      )}

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

export default function ChessBoard3D(props: ChessBoard3DProps) {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-2xl">
      <Canvas
        camera={{ position: [0, 8, 8], fov: 50 }}
        shadows
      >
        <Board3DContent {...props} />
      </Canvas>
    </div>
  );
}
