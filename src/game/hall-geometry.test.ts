import assert from 'node:assert/strict';
import test from 'node:test';
import { canStandAt, moveOnFloor, pathToExhibit, PLAYER_SPAWN } from './hall-geometry.ts';

test('the player can walk to every Exhibit from the entrance', () => {
  const destinations = [
    { x: 768, y: 390 }, { x: 1130, y: 425 }, { x: 400, y: 425 }, { x: 365, y: 745 },
    { x: 1180, y: 825 }, { x: 275, y: 510 }, { x: 1295, y: 470 }, { x: 1180, y: 610 },
  ];
  for (const destination of destinations) {
    assert.ok(canStandAt(destination), `Exhibit approach at ${destination.x},${destination.y} must be on the floor`);
    const route = pathToExhibit(PLAYER_SPAWN, destination);
    assert.ok(route.length, `Exhibit at ${destination.x},${destination.y} must have a route`);
    let position = { ...PLAYER_SPAWN };
    for (const waypoint of route) {
      position = moveOnFloor(position, waypoint.x - position.x, waypoint.y - position.y);
      assert.ok(Math.hypot(position.x - waypoint.x, position.y - waypoint.y) < 1, 'Every path segment must be walkable');
    }
    assert.ok(Math.hypot(position.x - destination.x, position.y - destination.y) < 24);
  }
});

test('movement stays inside the hall even after a large frame jump', () => {
  const position = moveOnFloor(PLAYER_SPAWN, 10000, 10000);
  assert.ok(canStandAt(position));
  assert.ok(position.x <= 1320 && position.y <= 992);
});

test('furniture stops movement and allows sliding along its edge', () => {
  assert.equal(canStandAt({ x: 1300, y: 610 }), false);
  const position = moveOnFloor({ x: 1180, y: 600 }, 80, 40);
  assert.ok(position.x <= 1200);
  assert.equal(position.y, 640);
  assert.ok(canStandAt(position));
});
