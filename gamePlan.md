# 3D Zombie Survival Game Development Plan

## Project Overview
A first-person perspective zombie survival game built with JavaScript, HTML5, and WebGL (Three.js). Players defend a gas station from increasingly difficult zombie hordes while managing resources and weapons.

## Core Technologies
- **Three.js** - 3D graphics engine
- **HTML5 Canvas** - Rendering surface
- **Web Audio API** - Sound effects and music
- **Pointer Lock API** - Mouse control for FPS camera
- **Vanilla JavaScript** - Game logic

## Phase 1: Foundation Setup (Week 1)

### 1.1 Project Structure
```
game/
├── index.html
├── js/
│   ├── main.js
│   ├── game.js
│   ├── player.js
│   ├── weapons.js
│   ├── zombies.js
│   ├── map.js
│   └── ui.js
├── assets/
│   ├── models/
│   ├── textures/
│   └── sounds/
└── css/
    └── style.css
```

### 1.2 Basic HTML Structure
- Canvas element for Three.js rendering
- UI elements for health, ammo, money display
- Crosshair overlay
- Game menu and pause screen

### 1.3 Three.js Scene Setup
- Initialize scene, camera, renderer
- Set up lighting (ambient + directional)
- Configure camera controls for FPS view
- Implement pointer lock for mouse look

## Phase 2: Player System (Week 2)

### 2.1 Player Controller
- **Movement System**
  - WASD for movement
  - Shift for running (increase speed by 1.5x)
  - Space for jumping (apply upward velocity)
  - Mouse for looking around

### 2.2 Collision Detection
- Implement AABB (Axis-Aligned Bounding Box) collision
- Player collision with walls, objects, zombies
- Ground detection for jumping mechanics
- Raycasting for wall collision prediction

### 2.3 Player Stats
- Health system (100 HP)
- Money counter (starts at 100)
- Current weapon tracking
- Ammunition management per weapon

## Phase 3: Weapon System (Week 3)

### 3.1 Weapon Classes
Create weapon objects with properties:
```javascript
weapons = {
  1: { name: "Pistol", damage: 25, ammo: 50, fireRate: 500, range: 100 },
  2: { name: "AR", damage: 35, ammo: 120, fireRate: 150, range: 150 },
  4: { name: "RPG", damage: 200, ammo: 5, fireRate: 2000, range: 200, explosive: true },
  5: { name: "SMG", damage: 20, ammo: 200, fireRate: 100, range: 80 },
  6: { name: "Rifle", damage: 80, ammo: 30, fireRate: 800, range: 250 }
}
```

### 3.2 Weapon Mechanics
- Number key switching (1,2,4,5,6)
- Raycasting for bullet trajectory
- Muzzle flash effects
- Reload animations and timing
- Weapon sway and recoil

### 3.3 Melee Combat
- Q key for melee attack
- Short-range damage detection
- Animation timing and cooldown

## Phase 4: Map Creation (Week 4)

### 4.1 Gas Station Environment
- **Main Building**: Interior with counter, shelves, windows
- **Exterior**: Parking area, fuel pumps, surrounding fence
- **Defensive Points**: Strategic cover locations
- **Spawn Points**: Zombie entry points around perimeter

### 4.2 Destructible/Buildable Elements
- **Wood Barriers**: Placeable wall segments (20 money each)
- **Interaction System**: Click to place barriers on valid surfaces
- **Collision Update**: Dynamic collision detection for new barriers

### 4.3 Environmental Details
- Lighting system (interior/exterior)
- Texture mapping for realism
- Interactive elements (doors, windows)

## Phase 5: Zombie AI System (Week 5)

### 5.1 Zombie Base Class
```javascript
class Zombie {
  constructor(type, health, damage, speed, size) {
    this.health = health;
    this.damage = damage;
    this.speed = speed;
    this.size = size;
    this.position = new THREE.Vector3();
    this.target = null; // Player reference
  }
}
```

### 5.2 Zombie Types by Horde Level
- **Horde 1-2**: Basic zombies (50 HP, 10 damage, normal size)
- **Horde 3-4**: Stronger zombies (80 HP, 15 damage, slightly larger)
- **Horde 5**: Giant boss zombie (500 HP, 50 damage, 3x size)

### 5.3 AI Behavior
- **Pathfinding**: Simple navigation toward player
- **Obstacle Avoidance**: Navigate around barriers
- **Attack Pattern**: Melee damage when in range
- **Group Behavior**: Multiple zombies coordinate attacks

## Phase 6: Game Logic & Progression (Week 6)

### 6.1 Horde System
```javascript
hordeConfig = {
  1: { zombieCount: 5, zombieType: "basic" },
  2: { zombieCount: 8, zombieType: "basic" },
  3: { zombieCount: 10, zombieType: "strong" },
  4: { zombieCount: 12, zombieType: "strong" },
  5: { zombieCount: 15, zombieType: "mixed", boss: true }
}
```

### 6.2 Spawn Management
- Wave-based spawning system
- Spawn points around map perimeter
- Delay between waves for preparation
- Progressive difficulty scaling

### 6.3 Economy System
- +5 money per zombie kill
- -20 money per wood barrier
- Ammo purchase system (optional expansion)

## Phase 7: User Interface (Week 7)

### 7.1 HUD Elements
- **Health Bar**: Visual health indicator
- **Ammo Counter**: Current/total ammunition
- **Money Display**: Current currency
- **Weapon Indicator**: Current weapon name/icon
- **Wave Counter**: Current horde number

### 7.2 Game States
- **Main Menu**: Start game, settings, instructions
- **Gameplay**: Main game loop
- **Pause Menu**: Resume, restart, quit
- **Game Over**: Score display, restart option

### 7.3 Interactive Elements
- Building mode toggle
- Barrier placement preview
- Weapon selection feedback

## Phase 8: Polish & Optimization (Week 8)

### 8.1 Performance Optimization
- Object pooling for bullets and zombies
- Frustum culling for rendering
- Level-of-detail (LOD) for distant objects
- Efficient collision detection

### 8.2 Audio Implementation
- Weapon firing sounds
- Zombie groans and death sounds
- Footstep audio
- Background music/ambiance

### 8.3 Visual Effects
- Particle effects for muzzle flash
- Blood splatter on zombie hits
- Explosion effects for RPG
- Screen shake for impact feedback

## Technical Implementation Notes

### Collision Detection Strategy
Use a combination of:
- **Broad Phase**: Spatial partitioning for initial filtering
- **Narrow Phase**: AABB collision for precise detection
- **Raycasting**: For bullet trajectories and line-of-sight

### Performance Considerations
- Limit simultaneous zombies (max 20 active)
- Use object pooling for frequently created/destroyed objects
- Implement simple LOD system for distant zombies
- Optimize texture sizes and polygon counts

### Browser Compatibility
- Target modern browsers with WebGL support
- Implement pointer lock fallback
- Handle mobile device limitations (optional)

## Testing Milestones

### Week 4 Checkpoint
- Player movement and camera controls working
- Basic weapon switching and firing
- Simple collision detection functional

### Week 6 Checkpoint
- Complete zombie AI and spawning
- Map fully navigable with barriers
- Core gameplay loop operational

### Week 8 Final
- All features implemented and tested
- Performance optimized
- Bug-free gameplay experience

## Expansion Ideas (Future Phases)
- Multiple maps/environments
- Weapon upgrade system
- Co-operative multiplayer
- Save/load game states
- Achievement system
- Mobile device support

## Risk Mitigation
- **Scope Creep**: Stick to core features first
- **Performance Issues**: Regular testing on target devices
- **Complex AI**: Start with simple zombie behavior
- **Asset Creation**: Use placeholder models initially

This plan provides a structured approach to building your zombie survival game while maintaining realistic development timelines and technical feasibility.