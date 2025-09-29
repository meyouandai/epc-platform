#!/usr/bin/env python3
"""
Dev Team 1 Auto-Monitor v1.2
Enhanced version with complete learning system integration
Watches dev_team_inbox/ and creates comprehensive learning records
"""

import os
import time
import subprocess
from pathlib import Path
from datetime import datetime
import platform

class DevTeamMonitorV12:
    def __init__(self):
        self.inbox_path = Path("dev_team_inbox")
        self.processed_files = set()
        self.system = platform.system()

        # Learning system paths
        self.learning_paths = {
            'active_problems': Path("problem_tracking/active_problems"),
            'self_solved': Path("problem_tracking/self_solved"),
            'dev_team_solved': Path("problem_tracking/dev_team_solved"),
            'final_solution': Path("final_solution")
        }

        # Ensure all paths exist
        for path in self.learning_paths.values():
            path.mkdir(parents=True, exist_ok=True)
        self.inbox_path.mkdir(exist_ok=True)

    def send_notification(self, title, message):
        """Send system notification based on OS"""
        try:
            if self.system == "Darwin":  # macOS
                script = f'display notification "{message}" with title "{title}" sound name "Glass"'
                subprocess.run(["osascript", "-e", script], capture_output=True)
            elif self.system == "Linux":
                subprocess.run(["notify-send", title, message], capture_output=True)
            elif self.system == "Windows":
                from win10toast import ToastNotifier
                toaster = ToastNotifier()
                toaster.show_toast(title, message, duration=10)
        except Exception as e:
            print(f"(Notification failed: {e})")

    def scan_for_problems(self):
        """Check for new .md files in inbox"""
        if not self.inbox_path.exists():
            self.inbox_path.mkdir(exist_ok=True)

        md_files = list(self.inbox_path.glob("*.md"))
        new_files = [f for f in md_files if f not in self.processed_files]

        return new_files

    def create_learning_record(self, problem_file, solution_file, processing_time):
        """Create comprehensive learning record in dev_team_solved/"""
        try:
            # Read the original problem
            with open(problem_file, 'r') as f:
                problem_content = f.read()

            # Read the solution
            with open(solution_file, 'r') as f:
                solution_content = f.read()

            # Extract solution timestamp from filename
            solution_timestamp = solution_file.stem.split('_')[-1]

            # Create comprehensive learning record
            learning_record = f"""# Complete Learning Record: {problem_file.name}

## Problem Escalation History
**Escalated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Dev Team Processing Time**: {processing_time:.1f} seconds
**Solution Generated**: {solution_timestamp}

---

## Original Problem Description
{problem_content}

---

## Dev Team 1 Analysis & Solution

{solution_content}

---

## Learning Insights

### Key Technical Decisions
- **Models Used**: Claude-Opus, Grok-4, Gemini-2.5, GPT-5-Mini
- **Competitive Collaboration**: Multiple models provided different approaches
- **Peer Review**: Models validated each other's solutions
- **Synthesis**: Best ideas combined into final solution

### Problem Classification
- **Complexity Level**: [To be analyzed - Required Dev Team escalation]
- **Problem Type**: [Extract from problem description]
- **Technology Stack**: [Extract from context]
- **Resolution Pattern**: Multi-model competitive analysis

### Future Reference
- **Similar Problems**: Look for patterns in problem_tracking/dev_team_solved/
- **Prevention Strategy**: Early detection of issues requiring multi-model analysis
- **Reusable Components**: Check final_solution/ for implementation details

---

## File References
- **Original Problem**: problem_tracking/dev_team_solved/{problem_file.name}
- **Complete Solution**: final_solution/{solution_file.name}
- **Processing Date**: {datetime.now().strftime('%Y-%m-%d')}

---

*This record captures the complete journey from Claude Code escalation to Dev Team 1 resolution, enabling compound learning for future similar challenges.*
"""

            # Save learning record
            learning_file = self.learning_paths['dev_team_solved'] / f"learning_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{problem_file.name}"
            with open(learning_file, 'w') as f:
                f.write(learning_record)

            print(f"📚 Learning record created: {learning_file.name}")
            return learning_file

        except Exception as e:
            print(f"⚠️ Failed to create learning record: {e}")
            return None

    def process_problem(self, problem_file):
        """Trigger Dev Team 1 for the problem and create learning records"""
        print(f"\n🚨 New problem detected: {problem_file.name}")
        print("🤖 Activating Dev Team 1...")

        # Send notification that processing started
        self.send_notification(
            "🤖 Dev Team 1 Activated",
            f"Working on: {problem_file.name}"
        )

        start_time = time.time()

        # Run dev_team_1.py with the problem file
        try:
            result = subprocess.run(
                ["python3", "dev_team_1.py", problem_file.name],
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout
            )

            elapsed_time = time.time() - start_time

            if result.returncode == 0:
                print("✅ Solution generated successfully!")

                # Find the latest solution file
                solution_files = sorted(self.learning_paths['final_solution'].glob("solution_*.md"),
                                     key=os.path.getmtime, reverse=True)

                if solution_files:
                    latest_solution = solution_files[0]

                    # Create comprehensive learning record
                    learning_file = self.create_learning_record(problem_file, latest_solution, elapsed_time)

                    # Send success notification
                    self.send_notification(
                        "✅ Solution Ready!",
                        f"{problem_file.name} solved in {elapsed_time:.1f}s\nCheck final_solution/ folder"
                    )
                else:
                    print("⚠️ Solution file not found")

                # Mark as processed
                self.processed_files.add(problem_file)

                # Move original problem to dev_team_solved for reference
                processed_path = self.learning_paths['dev_team_solved'] / f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{problem_file.name}"
                problem_file.rename(processed_path)

            else:
                print(f"⚠️ Error processing: {result.stderr}")

                # Send error notification
                self.send_notification(
                    "⚠️ Dev Team 1 Error",
                    f"Failed to solve {problem_file.name}\nCheck terminal for details"
                )

        except subprocess.TimeoutExpired:
            print("⏰ Processing timeout - problem may be too complex")
            self.send_notification(
                "⏰ Dev Team 1 Timeout",
                f"{problem_file.name} took too long (>2 min)"
            )
        except Exception as e:
            print(f"❌ Error: {e}")
            self.send_notification(
                "❌ Dev Team 1 Crashed",
                f"Error processing {problem_file.name}"
            )

    def show_status(self):
        """Display current system status"""
        print("\n📊 Dev Team 1 Learning System Status:")
        print("=" * 40)

        for name, path in self.learning_paths.items():
            if path.exists():
                file_count = len(list(path.glob("*.md")))
                print(f"{name:20}: {file_count:3} files")
            else:
                print(f"{name:20}: [MISSING]")

        inbox_count = len(list(self.inbox_path.glob("*.md"))) if self.inbox_path.exists() else 0
        print(f"{'dev_team_inbox':20}: {inbox_count:3} files")
        print("-" * 40)

    def run_monitor(self):
        """Main monitoring loop with enhanced learning system"""
        print("=" * 50)
        print("🎯 DEV TEAM 1 AUTO-MONITOR v1.2 ACTIVATED")
        print("=" * 50)
        print("📂 Monitoring: dev_team_inbox/")
        print("🔄 Drop .md files to auto-solve")
        print("📚 Learning system: problem_tracking/")
        print("⌨️  Press Ctrl+C to stop")
        print("-" * 50)

        # Show current status
        self.show_status()
        print("-" * 50)

        try:
            while True:
                # Check for new problems
                new_problems = self.scan_for_problems()

                if new_problems:
                    for problem_file in new_problems:
                        self.process_problem(problem_file)
                else:
                    # Visual heartbeat to show it's running
                    print(".", end="", flush=True)

                # Check every 30 seconds (reasonable for Claude Code escalations)
                time.sleep(30)

        except KeyboardInterrupt:
            print("\n\n🛑 Monitor stopped")
            print(f"📊 Processed {len(self.processed_files)} problems this session")
            self.show_status()

if __name__ == "__main__":
    monitor = DevTeamMonitorV12()
    monitor.run_monitor()