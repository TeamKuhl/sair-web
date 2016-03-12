/**
 * THREE.js Engine
 * Utility functions
 *
 * written by Matthias Neid
 **/

 function RoundRotation(value) {
   return Math.round((value % 1) * 100) / 100;
 }

 function RoundPosition(value) {
   return Math.round(value * 100) / 100;
 }
