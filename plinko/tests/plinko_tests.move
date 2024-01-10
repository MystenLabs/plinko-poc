
/* 
BLS_SIG - (First 36 bytes for 3 balls): 
[145, 245, 65, 236, 85, 81, 134, 254, 251, 16, 170, 230, 176, 28, 205, 5, 240, 51, 114, 153, 143, 139, 23, 154, 59, 116, 135, 59, 152, 176, 200, 157, 29, 73, 220, 14]
*/ 


// Multiplier Array: [9.0, 8.2, 6.5, 3.8, 1.0, 0.6, 0.4, 0.6, 1.0, 3.8, 6.5, 8.2, 9.0]

// Ball 1
// Bytes: [145, 245, 65, 236, 85, 81, 134, 254, 251, 16, 170, 230]
// Path (Even = 1, Odd = 0): [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]
// State: Count of 1's There are 6 instances of '1' in the path.
// Multiplier Index: 6 % 13 = 6
// Multiplier: According to your array, the 7th element (index 6) is "0.4x".
// Funds for Ball 1: 0.4 * 5 SUI = 2 SUI

// Ball 2
// Bytes: [176, 28, 205, 5, 240, 51, 114, 153, 143, 139, 23, 154]
// Path (Even = 1, Odd = 0): [1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1]
// State: Count of 1's = 5
// Multiplier Index: 5 % 13 = 5
// Multiplier: 0.6x
// Funds for Ball 2: 0.6 * 5 SUI = 3 SUI

// Ball 3
// Bytes: [59, 116, 135, 59, 152, 176, 200, 157, 29, 73, 220, 14]
// Path (Even = 1, Odd = 0): [0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1]
// State: Count of 1's = 6
// Multiplier Index: 6 % 13 = 6
// Multiplier: 0.4x
// Funds for Ball 3: 0.4 * 5 SUI = 2 SUI

// Total Funds: 2 SUI (Ball 1) + 3 SUI (Ball 2) + 2 SUI (Ball 3) = 7 SUI
// Final Trace (Combined for All Balls):
// [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1]
