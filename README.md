# 🧩 Sudoku Solver using Propositional Logic (SAT)

This project is a **Sudoku Solver** that uses **Propositional Logic** and a **SAT Solver**.  
The main idea is to encode Sudoku rules into **Boolean logic (CNF clauses)** and then solve them using a SAT engine.

---

## 🚀 Features
- Encode Sudoku puzzle into **CNF (Conjunctive Normal Form)**
- Apply Sudoku constraints:
  - ✅ One number per cell  
  - ✅ Unique numbers in each row, column, and 3×3 block  
  - ✅ Respect given clues  
- Use a SAT solver to check satisfiability
- Output a solved Sudoku grid (if SAT) or report UNSAT (no solution)

---

## 📖 How It Works
1. **Encode Puzzle**  
   - Each cell `(row, col)` and digit `(1–9)` is represented as a Boolean variable `X[r][c][d]`.  
   - Example: `X[1][1][5] = True` means *Cell (1,1) contains 5*.

2. **Sudoku Rules in Logic**
   - **Cell Rule**: Each cell has exactly one digit  
     `(X[r][c][1] ∨ X[r][c][2] ∨ … ∨ X[r][c][9])`  
   - **Row Rule**: Each digit appears once per row  
   - **Column Rule**: Each digit appears once per column  
   - **Block Rule**: Each digit appears once per 3×3 subgrid  
   - **Clues**: If puzzle says cell `(r,c) = d`, we add clause `X[r][c][d]`

3. **SAT Solver**
   - The CNF clauses are given to a SAT solver (like MiniSAT ).  
   - Solver returns either:  
     - **SAT** → A valid assignment exists → Sudoku solved  
     - **UNSAT** → No solution exists  

---

## 🛠️ Technologies Used
- **Language**: C++ 
- **Solver**: MiniSAT / custom DPLL implementation  
- **Optional (for visualization)**: React + Tailwind CSS  

---

## 📂 Project Structure
📦 sudoku-sat-solver
┣ 📜 README.md
┣ 📜 sudoku.cpp (or sudoku.py) # Core solver
┣ 📜 cnf_encoder.cpp # Encode Sudoku rules into CNF
┣ 📜 solver.cpp # SAT solver integration
┣ 📂 puzzles/ # Example Sudoku puzzles
┗ 📂 output/ # Solved Sudoku grids

yaml
Copy code

---

## ▶️ How to Run

### C++ (MiniSAT Example)
```sh
# Step 1: Clone repo
git clone <YOUR_GIT_URL>
cd sudoku-sat-solver

# Step 2: Compile
g++ sudoku.cpp -o sudoku

# Step 3: Run with puzzle input
./sudoku puzzles/input.txt

🧠 Real-World Applications of SAT
    ✅ Microchip & hardware verification (Intel/AMD CPUs)
    ✅ Software correctness (avionics, medical devices)
    ✅ Cryptography & security analysis
    ✅ AI planning & robotics
    ✅ Scheduling (airlines, universities, factories)

✨ Future Work
    Add graphical interface for puzzle input/output
    Support larger Sudoku variants (16×16, 25×25)
    Step-by-step solving visualization
    Optimize CNF encoding for speed