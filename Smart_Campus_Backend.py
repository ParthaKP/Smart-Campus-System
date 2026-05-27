import os
import sys
from typing import Dict, List, Tuple, Optional

# Optional scientific stack for Q8
try:
    import numpy as np
    import pandas as pd
    import matplotlib.pyplot as plt
    HAS_SCI = True
except Exception:
    HAS_SCI = False

STUDENTS: Dict[str, Dict] = {}

MAX_COURSES_PER_STUDENT = 5
RECORDS_FILE = "student_records.txt"         # Q6
ANALYTICS_FILE = "student_performance.csv"   # Q8 (if available)


def evaluate_grade(score: float) -> Tuple[str, str]:
    if score < 0 or score > 100:
        raise ValueError("Score must be between 0 and 100.")
    if 90 <= score <= 100:
        return "A", "Excellent"
    elif 75 <= score:
        return "B", "Very Good"
    elif 60 <= score:
        return "C", "Good"
    elif 40 <= score:
        return "D", "Average"
    else:
        return "F", "Needs Improvement"

def register_student() -> None:
    print("\n=== Student Registration and Grade Evaluation (Q1) ===")
    student_id = input("Enter student ID: ").strip()
    if not student_id:
        print("Invalid ID.")
        return
    if student_id in STUDENTS:
        print("ID already exists. Updating existing record.")

    name = input("Enter student name: ").strip()
    age_in = input("Enter age: ").strip()
    try:
        age = int(age_in)
        if age <= 0:
            raise ValueError
    except Exception:
        print("Invalid age.")
        return

    score_in = input("Enter exam score (0-100): ").strip()
    try:
        score = float(score_in)
        grade, remark = evaluate_grade(score)
    except Exception as e:
        print(f"Score error: {e}")
        return

    STUDENTS[student_id] = {
        "id": student_id,
        "name": name,
        "age": age,
        "scores": score,
        "grade": grade,
        "remark": remark,
        "courses": [],
        "fees": {"tuition": 0, "hostel": 0, "transport": 0, "total": 0},
    }

    print("\n--- Student Report ---")
    print(f"ID: {student_id}")
    print(f"Name: {name}")
    print(f"Score: {score}")
    print(f"Grade: {grade}")
    print(f"Performance Remark: {remark}")

def manage_course_enrollment() -> None:
    print("\n=== Course Enrollment Management (Q2) ===")
    student_id = input("Enter student ID: ").strip()
    if student_id not in STUDENTS:
        print("Student not found. Register first (Q1).")
        return

    courses = STUDENTS[student_id]["courses"]
    print(f"Current courses: {len(courses)}/{MAX_COURSES_PER_STUDENT}")
    while True:
        if len(courses) >= MAX_COURSES_PER_STUDENT:
            print("Maximum course limit reached!")
            break

        course_name = input("Enter course name (or 'done' to finish): ").strip()
        if course_name.lower() == "done":
            break
        if not course_name:
            print("Empty course name! Skipping...")
            continue

        credits_in = input("Enter credit value: ").strip()
        if not credits_in.isdigit():
            print("Invalid credit value! Skipping entry...")
            continue
        credits = int(credits_in)
        if credits <= 0:
            print("Credit must be positive! Skipping entry...")
            continue

        courses.append((course_name, credits))
        print(f"Course '{course_name}' with {credits} credits added.\n")

    print("\n--- Enrollment Report ---")
    for c, cr in courses:
        print(f"Course: {c}, Credits: {cr}")
    print("Total courses enrolled:", len(courses))

def show_student_records_and_events() -> None:
    print("\n=== Student Record Data Management (Q3) ===")
    if not STUDENTS:
        print("No students available.")
        return

    print("=== Student Records ===")
    for s in STUDENTS.values():
        print(f"ID: {s['id']}")
        print(f"Name: {s['name']}")
        print(f"Age: {s['age']}")
        print(f"Score: {s['scores']} Grade: {s['grade']} ({s['remark']})")
        print(f"Courses: {s['courses']}")
        print(f"Fees: {s['fees']}")
        print("-----------------------")

    names = {s["name"] for s in STUDENTS.values()}
    event_A = {n for i, n in enumerate(names) if i % 2 == 0}
    event_B = names - event_A

    common = event_A & event_B
    all_p = event_A | event_B
    only_A = event_A - event_B

    print("\n=== Event Participation Analysis ===")
    print("Common Participants:", common)
    print("All Participants:", all_p)
    print("Only Event A Participants:", only_A)

def bubble_sort(arr: List[int]) -> List[int]:
    a = arr[:]
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

def selection_sort(arr: List[int]) -> List[int]:
    a = arr[:]
    n = len(a)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
    return a

def linear_search(arr: List[int], target: int) -> int:
    for i, v in enumerate(arr):
        if v == target:
            return i
    return -1

def binary_search(arr: List[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

def sorting_searching_module() -> None:
    print("\n=== Sorting and Searching Student IDs (Q4) ===")
    if not STUDENTS:
        print("No students registered.")
        return
    ids_raw = list(STUDENTS.keys())
    ids = []
    mapping = {}
    for sid in ids_raw:
        try:
            val = int(sid)
        except ValueError:
            val = abs(hash(sid)) % 10**6
        ids.append(val)
        mapping[val] = sid

    print("Original IDs:", [mapping[i] for i in ids])
    bsorted = bubble_sort(ids)
    ssorted = selection_sort(ids)
    print("Sorted IDs (Bubble Sort):", [mapping[i] for i in bsorted])
    print("Sorted IDs (Selection Sort):", [mapping[i] for i in ssorted])

    target_in = input("Enter a student ID to search: ").strip()
    try:
        t_int = int(target_in)
    except ValueError:
        t_int = abs(hash(target_in)) % 10**6

    li = linear_search(bsorted, t_int)
    if li != -1:
        print(f"Linear Search: ID {target_in} found at index {li}")
    else:
        print("Linear Search: ID not found")

    bi = binary_search(bsorted, t_int)
    if bi != -1:
        print(f"Binary Search: ID {target_in} found at index {bi}")
    else:
        print("Binary Search: ID not found")

def calculate_fee(tuition_fee: int, hostel_fee: int = 0, transportation_fee: int = 0) -> int:
    return tuition_fee + hostel_fee + transportation_fee

def fee_calculation_module() -> None:
    print("\n=== Student Fee Calculation (Q5) ===")
    student_id = input("Enter student ID: ").strip()
    if student_id not in STUDENTS:
        print("Student not found.")
        return

    try:
        tuition = int(input("Enter tuition fee: ").strip())
        hostel = input("Enter hostel fee (blank for 0): ").strip()
        transport = input("Enter transportation fee (blank for 0): ").strip()
        hostel_fee = int(hostel) if hostel else 0
        transport_fee = int(transport) if transport else 0
        total = calculate_fee(tuition, hostel_fee, transport_fee)
    except Exception:
        print("Invalid fee input.")
        return

    STUDENTS[student_id]["fees"] = {
        "tuition": tuition,
        "hostel": hostel_fee,
        "transport": transport_fee,
        "total": total,
    }
    print(f"Total Fee: {total}")

def write_academic_records(file_path: str = RECORDS_FILE) -> None:
    print("\n=== Writing Academic Records to File (Q6) ===")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("ID,Name,Marks\n")
        for s in STUDENTS.values():
            f.write(f"{s['id']},{s['name']},{int(round(s['scores']))}\n")
    print(f"Records written to {file_path}")

def read_and_report_records(file_path: str = RECORDS_FILE) -> None:
    print("\n=== Reading and Reporting Academic Records (Q6) ===")
    if not os.path.exists(file_path):
        print("No records file found. Please write records first.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        records = f.readlines()

    print("--- Raw Records ---")
    for r in records:
        print(r.strip())

    total_students = 0
    total_marks = 0
    highest_marks = -1
    top_student = ""

    for rec in records[1:]:
        parts = rec.strip().split(",")
        if len(parts) != 3:
            continue
        _, name, marks_s = parts
        try:
            marks = int(marks_s)
        except ValueError:
            continue
        total_students += 1
        total_marks += marks
        if marks > highest_marks:
            highest_marks = marks
            top_student = name

    if total_students > 0:
        avg = total_marks / total_students
        print("\n--- Report ---")
        print("Total Students:", total_students)
        print("Average Marks:", avg)
        print(f"Top Student: {top_student} with {highest_marks} marks")
    else:
        print("No valid student records to report.")

class MissingFileOrFolderError(Exception):
    pass

def scan_directory(path: str) -> None:
    print("\n=== Directory Scanning (Q7) ===")
    try:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Invalid directory path: {path}")

        print(f"\nScanning directory: {path}\n")
        empty_leaf_found = False
        for root, dirs, files in os.walk(path):
            level = root.replace(path, "").count(os.sep)
            indent = " " * 4 * level
            print(f"{indent}{os.path.basename(root) or root}/")
            sub_indent = " " * 4 * (level + 1)
            for f in files:
                print(f"{sub_indent}{f}")
            if not dirs and not files:
                empty_leaf_found = True
        if empty_leaf_found:
            raise MissingFileOrFolderError("Empty folder detected in scanned tree.")
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except MissingFileOrFolderError as e:
        print(f"Custom Error: {e}")
    except Exception as e:
        print(f"Unexpected Error: {e}")

def export_to_csv_for_analytics(path: str = ANALYTICS_FILE) -> None:
    """Export in-memory students to a CSV compatible with analytics:
       columns: Name, Math, Science, English
       We’ll map 'scores' to all three just as a placeholder unless the user wants custom subject inputs.
    """
    if not STUDENTS:
        print("No students to export.")
        return
    with open(path, "w", encoding="utf-8") as f:
        f.write("Name,Math,Science,English\n")
        for s in STUDENTS.values():
            sc = int(round(s["scores"]))
            f.write(f"{s['name']},{sc},{sc},{sc}\n")
    print(f"Exported {len(STUDENTS)} students to {path} for analytics.")

def analytics_module(csv_path: str = ANALYTICS_FILE) -> None:
    print("\n=== Student Performance Analytics (Q8) ===")
    if not HAS_SCI:
        print("NumPy/Pandas/Matplotlib not available. Install them to run analytics.")
        return
    try:
        df = pd.read_csv(csv_path)
        print("\n--- Raw Data ---")
        print(df.head())

        print("\n--- Statistical Summary ---")
        print(df.describe())

        scores = df[["Math", "Science", "English"]].to_numpy()
        mean_scores = np.mean(scores, axis=0)
        median_scores = np.median(scores, axis=0)
        std_dev_scores = np.std(scores, axis=0)

        print("\n--- NumPy Analysis ---")
        print(f"Mean Scores (Math, Science, English): {mean_scores}")
        print(f"Median Scores (Math, Science, English): {median_scores}")
        print(f"Standard Deviation (Math, Science, English): {std_dev_scores}")

        top_math = df.loc[df["Math"].idxmax(), "Name"]
        top_science = df.loc[df["Science"].idxmax(), "Name"]
        top_english = df.loc[df["English"].idxmax(), "Name"]

        print("\n--- Top Performers ---")
        print(f"Math: {top_math}")
        print(f"Science: {top_science}")
        print(f"English: {top_english}")

        subjects = ["Math", "Science", "English"]
        plt.figure()
        plt.bar(subjects, mean_scores, color=["blue", "green", "orange"])
        plt.title("Average Scores per Subject")
        plt.xlabel("Subjects")
        plt.ylabel("Average Score")
        plt.tight_layout()
        plt.show()

        plt.figure()
        df.plot(x="Name", y=["Math", "Science", "English"], kind="bar")
        plt.title("Student Performance Comparison")
        plt.ylabel("Scores")
        plt.tight_layout()
        plt.show()

    except FileNotFoundError:
        print(f"Error: CSV not found at {csv_path}. Export first or provide a valid path.")
    except Exception as e:
        print(f"Unexpected Error: {e}")

def ensure_student_exists_flow() -> None:
    """Quick helper to add a demo student if list is empty."""
    if not STUDENTS:
        print("No students found. Creating a demo student (ID=101).")
        STUDENTS["101"] = {
            "id": "101",
            "name": "Priya",
            "age": 20,
            "scores": 82.0,
            "grade": "B",
            "remark": "Very Good",
            "courses": [("Mathematics", 4), ("Chemistry", 3)],
            "fees": {"tuition": 50000, "hostel": 30000, "transport": 10000, "total": 90000},
        }

def main_menu() -> None:
    while True:
        print("\n=== Smart Campus Information System ===")
        print("1. Register student and evaluate grade (Q1)")
        print("2. Manage course enrollment (Q2)")
        print("3. Show student records and event analysis (Q3)")
        print("4. Sorting and searching student IDs (Q4)")
        print("5. Calculate and store student fee (Q5)")
        print("6. Write academic records to file (Q6)")
        print("7. Read and report academic records from file (Q6)")
        print("8. Scan a directory with exception handling (Q7)")
        print("9. Export current data to CSV for analytics (Q8)")
        print("10. Run analytics on CSV (Q8)")
        print("0. Exit")

        choice = input("Enter your choice: ").strip()
        if choice == "1":
            register_student()
        elif choice == "2":
            ensure_student_exists_flow()
            manage_course_enrollment()
        elif choice == "3":
            ensure_student_exists_flow()
            show_student_records_and_events()
        elif choice == "4":
            ensure_student_exists_flow()
            sorting_searching_module()
        elif choice == "5":
            ensure_student_exists_flow()
            fee_calculation_module()
        elif choice == "6":
            ensure_student_exists_flow()
            write_academic_records()
        elif choice == "7":
            read_and_report_records()
        elif choice == "8":
            path = input("Enter directory path to scan: ").strip()
            scan_directory(path)
        elif choice == "9":
            ensure_student_exists_flow()
            export_to_csv_for_analytics()
        elif choice == "10":
            path = input(f"Enter CSV path for analytics (default: {ANALYTICS_FILE}): ").strip()
            analytics_module(path or ANALYTICS_FILE)
        elif choice == "0":
            print("Exiting. Goodbye.")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":

    if not STUDENTS:
        STUDENTS["105"] = {
            "id": "105",
            "name": "Arjun",
            "age": 21,
            "scores": 85.0,
            "grade": "A",
            "remark": "Excellent",
            "courses": [],
            "fees": {"tuition": 0, "hostel": 0, "transport": 0, "total": 0},
        }
        STUDENTS["102"] = {
            "id": "102",
            "name": "Meera",
            "age": 20,
            "scores": 92.0,
            "grade": "A",
            "remark": "Excellent",
            "courses": [],
            "fees": {"tuition": 0, "hostel": 0, "transport": 0, "total": 0},
        }
    main_menu()