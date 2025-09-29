#!/usr/bin/env python3
"""
Dev Team 1 - Multi-Model Competitive Development Team
Uses actual AI models (GPT-4, Claude Opus, Gemini, Mixtral) for competitive collaboration
Integrates with claude_code_development_framework.txt escalation system
"""

import os
import json
import asyncio
import time
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️ python-dotenv not installed. Loading environment manually...")
    # Manual .env loading
    if os.path.exists('.env'):
        with open('.env', 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value

# API clients for different models
import anthropic

# Try to import optional APIs - gracefully handle missing ones
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import google.generativeai as genai
    GOOGLE_AVAILABLE = True
except ImportError:
    GOOGLE_AVAILABLE = False


class DevTeam1:
    """Multi-model competitive development team"""

    def __init__(self):
        """Initialize all AI model clients"""
        self.models = {}
        self.setup_clients()

        # Framework integration paths
        self.inbox_path = Path("dev_team_inbox")
        self.solution_path = Path("final_solution")
        self.inbox_path.mkdir(exist_ok=True)
        self.solution_path.mkdir(exist_ok=True)

    def setup_clients(self):
        """Setup API clients for all available models"""

        # Anthropic Claude Haiku 3.5 (same model as 4-agent system)
        try:
            # Use the same key that works in 4-agent system
            anthropic_key = os.getenv('EINSTEIN_TOKYO_001')
            if anthropic_key:
                self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key)
                self.models['Claude-Opus'] = {
                    'client': self.anthropic_client,
                    'model': 'claude-opus-4-1-20250805',  # Upgraded to Opus 4
                    'active': True
                }
                print("✓ Claude Opus 4 client ready")
            else:
                print("⚠️ Anthropic API key not found")
        except Exception as e:
            print(f"⚠️ Claude setup failed: {e}")

        # Grok (x.ai)
        try:
            xai_key = os.getenv('XAI_API_KEY')
            if xai_key:
                self.models['Grok'] = {
                    'client': 'xai',
                    'model': 'grok-4-fast-reasoning',
                    'api_key': xai_key,
                    'active': True
                }
                print("✓ Grok client ready")
            else:
                print("⚠️ XAI API key not found")
        except Exception as e:
            print(f"⚠️ Grok setup failed: {e}")

        # OpenAI GPT-4 (optional)
        if OPENAI_AVAILABLE:
            try:
                openai_key = os.getenv('OPENAI_API_KEY')
                if openai_key:
                    self.openai_client = openai.OpenAI(api_key=openai_key)
                    self.models['GPT-4'] = {
                        'client': self.openai_client,
                        'model': 'gpt-5-mini',
                        'active': True
                    }
                    print("✓ GPT-4 client ready")
                else:
                    print("⚠️ OpenAI API key not found")
            except Exception as e:
                print(f"⚠️ GPT-4 setup failed: {e}")

        # Google Gemini (optional)
        if GOOGLE_AVAILABLE:
            try:
                google_key = os.getenv('GOOGLE_API_KEY')
                if google_key:
                    genai.configure(api_key=google_key)
                    self.models['Gemini-Pro'] = {
                        'client': 'google',
                        'model': 'gemini-2.5-flash',
                        'active': True
                    }
                    print("✓ Gemini Pro client ready")
                else:
                    print("⚠️ Google API key not found")
            except Exception as e:
                print(f"⚠️ Gemini setup failed: {e}")

        if not self.models:
            raise Exception("No AI models available! Check your API keys.")

        print(f"Dev Team 1 initialized with {len(self.models)} models")

    async def solve_problem(self, problem_file: str) -> str:
        """Main entry point - solve problem from escalation file"""

        print(f"🔥 Dev Team 1 activated for: {problem_file}")

        # Read the problem from escalation file
        problem_data = self.parse_escalation_file(problem_file)

        # Phase 1: All models work on problem in parallel
        print("🧠 Phase 1: Parallel analysis...")
        solutions = await self.parallel_analysis(problem_data)

        # Phase 2: Peer review - each model ranks others
        print("⚖️ Phase 2: Peer review...")
        rankings = await self.peer_review(solutions, problem_data)

        # Phase 3: Synthesize best solution
        print("🔬 Phase 3: Solution synthesis...")
        final_solution = await self.synthesize_solution(solutions, rankings, problem_data)

        # Phase 4: Save to final_solution folder for Claude Code
        print("💾 Phase 4: Delivering solution...")
        solution_file = self.save_solution(final_solution, problem_file)

        return solution_file

    def parse_escalation_file(self, problem_file: str) -> Dict:
        """Parse escalation file from claude_code_development_framework format"""

        problem_path = self.inbox_path / problem_file

        if not problem_path.exists():
            raise FileNotFoundError(f"Problem file not found: {problem_path}")

        with open(problem_path, 'r') as f:
            content = f.read()

        # Extract key sections from markdown
        problem_data = {
            'raw_content': content,
            'title': '',
            'project_context': '',
            'issue_details': '',
            'attempts': [],
            'requirements': ''
        }

        # Simple parsing - could be enhanced
        lines = content.split('\n')
        current_section = ''

        for line in lines:
            if line.startswith('# Problem:'):
                problem_data['title'] = line.replace('# Problem:', '').strip()
            elif line.startswith('## Project Context'):
                current_section = 'project_context'
            elif line.startswith('## Issue Details'):
                current_section = 'issue_details'
            elif line.startswith('## Attempts Made'):
                current_section = 'attempts'
            elif line.startswith('## Requirements'):
                current_section = 'requirements'
            elif line.strip() and current_section:
                if current_section not in problem_data:
                    problem_data[current_section] = ''
                problem_data[current_section] += line + '\n'

        return problem_data

    async def parallel_analysis(self, problem_data: Dict) -> Dict[str, Dict]:
        """All models analyze problem simultaneously"""

        problem_prompt = self.format_problem_prompt(problem_data)
        solutions = {}

        # Create tasks for all active models
        tasks = []
        for model_name, model_config in self.models.items():
            if model_config['active']:
                task = asyncio.create_task(
                    self.get_model_solution(model_name, model_config, problem_prompt)
                )
                tasks.append((model_name, task))

        # Execute all in parallel
        for model_name, task in tasks:
            try:
                solution = await task
                solutions[model_name] = {
                    'solution': solution,
                    'model': model_name,
                    'timestamp': datetime.now().isoformat()
                }
                print(f"   ✓ {model_name} solution complete")
            except Exception as e:
                print(f"   ⚠️ {model_name} failed: {e}")
                solutions[model_name] = {
                    'solution': f"Error: {str(e)}",
                    'model': model_name,
                    'error': True
                }

        return solutions

    async def get_model_solution(self, model_name: str, model_config: Dict, prompt: str) -> str:
        """Get solution from specific model"""

        client = model_config['client']
        model = model_config['model']

        if model_name == 'Claude-Opus':
            response = client.messages.create(
                model=model,
                max_tokens=2000,
                temperature=0.7,
                system="You are an expert software developer helping solve development problems.",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text

        elif model_name == 'Grok':
            # Grok uses x.ai API with OpenAI-compatible format
            api_key = model_config['api_key']
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }

            data = {
                "messages": [
                    {"role": "system", "content": "You are an expert software developer helping solve development problems."},
                    {"role": "user", "content": prompt}
                ],
                "model": model_config['model'],
                "stream": False,
                "temperature": 0.7,
                "max_tokens": 2000
            }

            response = requests.post(
                "https://api.x.ai/v1/chat/completions",
                headers=headers,
                json=data
            )

            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                raise Exception(f"Grok API error: {response.status_code} - {response.text}")

        elif model_name == 'GPT-4' and OPENAI_AVAILABLE:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are an expert software developer helping solve development problems."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            return response.choices[0].message.content

        elif model_name == 'Gemini-Pro' and GOOGLE_AVAILABLE:
            model_instance = genai.GenerativeModel(model)
            response = model_instance.generate_content(
                f"You are an expert software developer. {prompt}",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=2000,
                    temperature=0.7
                )
            )
            return response.text

        else:
            raise ValueError(f"Unknown or unavailable model: {model_name}")

    def format_problem_prompt(self, problem_data: Dict) -> str:
        """Format problem data into prompt for models"""

        prompt = f"""
DEVELOPMENT PROBLEM TO SOLVE:

Title: {problem_data.get('title', 'Unknown')}

Project Context:
{problem_data.get('project_context', 'Not provided')}

Issue Details:
{problem_data.get('issue_details', 'Not provided')}

Previous Attempts:
{problem_data.get('attempts', 'None documented')}

Requirements:
{problem_data.get('requirements', 'Not specified')}

Please provide a clear, implementable solution to this development problem. Include:
1. Root cause analysis
2. Specific implementation steps
3. Code examples where relevant
4. Potential gotchas or considerations
5. How to verify the solution works

Focus on practical, working solutions rather than theoretical approaches.
"""
        return prompt

    async def peer_review(self, solutions: Dict, problem_data: Dict) -> Dict:
        """Each model reviews and ranks all solutions"""

        # Create review prompt with all solutions
        review_prompt = self.format_review_prompt(solutions, problem_data)

        rankings = {}

        # Each model reviews all solutions
        for reviewer_name, reviewer_config in self.models.items():
            if not reviewer_config['active'] or reviewer_name not in solutions:
                continue

            try:
                review = await self.get_model_solution(
                    reviewer_name,
                    reviewer_config,
                    review_prompt
                )
                rankings[reviewer_name] = self.parse_ranking(review)
                print(f"   ✓ {reviewer_name} review complete")
            except Exception as e:
                print(f"   ⚠️ {reviewer_name} review failed: {e}")

        return rankings

    def format_review_prompt(self, solutions: Dict, problem_data: Dict) -> str:
        """Format solutions for peer review"""

        solutions_text = ""
        for i, (model_name, solution_data) in enumerate(solutions.items(), 1):
            if solution_data.get('error'):
                continue
            solutions_text += f"\n=== SOLUTION {i} (from {model_name}) ===\n"
            solutions_text += solution_data['solution']
            solutions_text += "\n"

        prompt = f"""
PEER REVIEW TASK:

Original Problem: {problem_data.get('title', 'Unknown')}

Below are multiple solutions to the same development problem. Please review each solution and rank them from best to worst.

{solutions_text}

Please provide:
1. Rankings (1=best, 2=second best, etc.)
2. Brief justification for your top choice
3. Any insights that could improve the solutions

Format your response as:
RANKINGS:
Solution 1: [rank]
Solution 2: [rank]
etc.

JUSTIFICATION:
[explanation of top choice]

INSIGHTS:
[suggestions for improvement]
"""
        return prompt

    def parse_ranking(self, review_text: str) -> Dict:
        """Parse ranking from review text"""

        # Simple parsing - could be enhanced
        rankings = {}
        lines = review_text.split('\n')

        in_rankings = False
        for line in lines:
            if 'RANKINGS:' in line:
                in_rankings = True
                continue
            elif 'JUSTIFICATION:' in line or 'INSIGHTS:' in line:
                in_rankings = False
                continue

            if in_rankings and ':' in line:
                parts = line.split(':')
                if len(parts) >= 2:
                    solution = parts[0].strip()
                    try:
                        rank = int(parts[1].strip())
                        rankings[solution] = rank
                    except ValueError:
                        pass

        return rankings

    async def synthesize_solution(self, solutions: Dict, rankings: Dict, problem_data: Dict) -> str:
        """Create cascading solution delivery with all ranked solutions"""

        # Get all solutions ranked by peer review
        ranked_solutions = self.find_best_solution(solutions, rankings)

        if not ranked_solutions:
            return "No valid solutions available"

        # Create cascading solution format
        cascading_solution = f"""# Dev Team 1 Solutions - Ranked by Peer Review

Problem: {problem_data.get('title', 'Unknown')}
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

"""

        # Add each solution in ranked order
        for i, solution_data in enumerate(ranked_solutions, 1):
            # Check for ties
            tie_info = ""
            if i < len(ranked_solutions):
                current_rank = solution_data['avg_rank']
                next_rank = ranked_solutions[i]['avg_rank']
                if abs(current_rank - next_rank) < 0.01:  # Essentially tied
                    current_first_place = solution_data['first_place_votes']
                    next_first_place = ranked_solutions[i]['first_place_votes']
                    if current_first_place == next_first_place:
                        tie_info = " (TIE - Claude Code choose best fit)"
                    else:
                        tie_info = f" (Tie broken by #1 votes: {current_first_place} vs {next_first_place})"

            cascading_solution += f"""
---

## Solution {i}{tie_info} - {solution_data['model']}
**Average Rank:** {solution_data['avg_rank']:.2f} | **#1 Votes:** {solution_data['first_place_votes']}/{solution_data['total_votes']}

{solution_data['solution']}

"""

        # Add implementation instructions
        cascading_solution += f"""
---

## Implementation Instructions

**For Claude Code:**
1. Try Solution 1 first (highest ranked by peer review)
2. If Solution 1 doesn't work, try Solution 2
3. Continue through solutions in order until one works
4. Each solution represents a different validated approach

**Tie-Breaking Notes:**
- Ties broken first by most #1 votes from peer review
- If still tied, Claude Code should choose based on problem context
- All solutions have been peer-reviewed by {len(self.models)} AI models

**Models Participated:** {', '.join([name for name in self.models.keys() if self.models[name]['active']])}
"""

        return cascading_solution

    def find_best_solution(self, solutions: Dict, rankings: Dict) -> List[Dict]:
        """Find all solutions ranked by peer review with tie-breaking"""

        # Count votes and first-place votes for each solution
        vote_counts = {}
        first_place_votes = {}

        for reviewer, review_rankings in rankings.items():
            for solution, rank in review_rankings.items():
                if solution not in vote_counts:
                    vote_counts[solution] = []
                    first_place_votes[solution] = 0
                vote_counts[solution].append(rank)
                if rank == 1:
                    first_place_votes[solution] += 1

        # Calculate averages and create ranked list
        solution_rankings = []
        for solution, ranks in vote_counts.items():
            avg_rank = sum(ranks) / len(ranks)
            solution_rankings.append({
                'solution_key': solution,
                'avg_rank': avg_rank,
                'first_place_votes': first_place_votes[solution],
                'total_votes': len(ranks)
            })

        # Sort by average rank (primary), then by first-place votes (tie-breaker)
        solution_rankings.sort(key=lambda x: (x['avg_rank'], -x['first_place_votes']))

        # Map solution keys back to actual solutions
        ranked_solutions = []
        for ranking in solution_rankings:
            solution_key = ranking['solution_key']
            # Find the actual solution content
            for model_name, solution_data in solutions.items():
                if model_name in solution_key or f"from {model_name}" in solution_key:
                    ranked_solutions.append({
                        'model': model_name,
                        'solution': solution_data['solution'],
                        'avg_rank': ranking['avg_rank'],
                        'first_place_votes': ranking['first_place_votes'],
                        'total_votes': ranking['total_votes']
                    })
                    break

        return ranked_solutions

    def format_other_solutions(self, solutions: Dict, best_solution: str) -> str:
        """Format other solutions for reference"""

        other_solutions = ""
        for model_name, solution_data in solutions.items():
            if solution_data['solution'] != best_solution and not solution_data.get('error'):
                other_solutions += f"\n{model_name}: {solution_data['solution'][:500]}...\n"

        return other_solutions

    def save_solution(self, cascading_solution: str, problem_file: str) -> str:
        """Save cascading solution for Claude Code to find"""

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        solution_filename = f"solution_{timestamp}.md"
        solution_path = self.solution_path / solution_filename

        # The cascading_solution already contains full formatting
        solution_content = f"""# Dev Team 1 Cascading Solutions

## Problem Source
{problem_file}

{cascading_solution}

---
*Cascading solution delivery - try in ranked order*
"""

        with open(solution_path, 'w') as f:
            f.write(solution_content)

        print(f"💾 Cascading solution saved: {solution_path}")
        return str(solution_path)


async def main():
    """Main entry point for Dev Team 1"""

    if len(os.sys.argv) < 2:
        print("Usage: python dev_team_1.py <problem_file>")
        print("Example: python dev_team_1.py problem_stripe_payment_integration_20250918_1430.md")
        return

    problem_file = os.sys.argv[1]

    try:
        dev_team = DevTeam1()
        solution_file = await dev_team.solve_problem(problem_file)
        print(f"\n🎉 Solution complete: {solution_file}")

    except Exception as e:
        print(f"\n❌ Dev Team 1 failed: {e}")
        return 1


if __name__ == "__main__":
    asyncio.run(main())