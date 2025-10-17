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
          <group>
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.32, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.25, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.18, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'r':
        return (
          <group>
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.35, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.28, 0.2, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.3, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.24, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.18, 0.72, 0]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.12]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[-0.18, 0.72, 0]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.12]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.72, 0.18]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.12]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.72, -0.18]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.12]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'n':
        return (
          <group>
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.35, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.28, 0.2, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.05, 0.42, 0]} rotation={[0.3, 0, 0.2]} castShadow>
              <boxGeometry args={[0.28, 0.45, 0.22]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.08, 0.68, 0.08]} castShadow>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.12, 0.75, 0.16]} rotation={[-0.5, 0, 0]} castShadow>
              <coneGeometry args={[0.08, 0.18, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0.05, 0.62, 0.18]} castShadow>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'b':
        return (
          <group>
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.35, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.28, 0.2, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
              <sphereGeometry args={[0.24, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.52, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.18, 0.25, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.92, 0]} castShadow>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.98, 0]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 0.05, 0.05]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        );
      case 'q':
        return (
          <group>
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.38, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.3, 0.25, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.24, 0.2, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.65, 0]} castShadow>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.92, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.15, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * Math.PI * 2) / 5;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * 0.22, 1.05, Math.sin(angle) * 0.22]}
                  castShadow
                >
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
                </mesh>
              );
            })}
          </group>
        );
      case 'k':
        return (
          <group>
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.38, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.3, 0.25, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.24, 0.2, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.22, 0.3, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.82, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.15, 8]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.98, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.16, 0.18, 32]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.12, 0]} castShadow>
              <boxGeometry args={[0.32, 0.08, 0.08]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.26, 0]} castShadow>
              <boxGeometry args={[0.08, 0.36, 0.08]} />
              <meshStandardMaterial color={pieceColor} metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-8, 8, -8]} intensity={0.4} />
      <spotLight
        position={[0, 15, 0]}
        intensity={0.3}
        angle={Math.PI / 3}
        penumbra={0.5}
        castShadow
      />

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
