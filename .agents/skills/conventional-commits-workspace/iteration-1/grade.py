"""Grade conventional-commits eval outputs."""
import json
import os
import re
import sys

WORKSPACE = os.path.dirname(os.path.abspath(__file__))

EVALS = [
    {
        "eval_id": 1,
        "eval_name": "jwt-bugfix",
        "assertions": [
            {
                "name": "uses_fix_type",
                "text": "Uses 'fix' as the commit type",
                "check": lambda text: bool(re.search(r'fix(?:\(|:)', text))
            },
            {
                "name": "includes_scope",
                "text": "Includes a scope in parentheses",
                "check": lambda text: bool(re.search(r'\w+\(\w+\):', text))
            },
            {
                "name": "single_commit",
                "text": "Proposes exactly one commit",
                "check": lambda text: text.count('git commit') == 1
            },
            {
                "name": "body_explains_why",
                "text": "Body explains the problem (blank screen / 401)",
                "check": lambda text: bool(re.search(r'(blank|401|pantalla|expirad?|stuck|hang)', text, re.IGNORECASE))
            },
            {
                "name": "summary_imperative",
                "text": "Summary is written in imperative mood",
                "check": lambda text: bool(re.search(r'"(?:fix|feat|docs|chore|refactor|style|test|perf|build|ci|revert)\(?.*?\)?: (add|redirect|update|fix|prevent|allow|change|remove|implement|correct|handle)', text, re.IGNORECASE))
            },
        ]
    },
    {
        "eval_id": 2,
        "eval_name": "mixed-readme-and-validation",
        "assertions": [
            {
                "name": "splits_into_two_commits",
                "text": "Splits unrelated changes into two commits",
                "check": lambda text: text.count('git commit') >= 2
            },
            {
                "name": "uses_docs_for_readme",
                "text": "Uses 'docs' type for the README typo fix",
                "check": lambda text: bool(re.search(r'docs(?:\(|:)', text))
            },
            {
                "name": "uses_fix_for_validation",
                "text": "Uses 'fix' type for the email validation fix",
                "check": lambda text: bool(re.search(r'fix(?:\(|:)', text))
            },
            {
                "name": "does_not_mix_in_one_commit",
                "text": "Does not propose a single commit mixing both changes",
                "check": lambda text: not bool(re.search(r'git commit.*(?:README.*valid|valid.*README)', text))
            },
        ]
    },
    {
        "eval_id": 3,
        "eval_name": "notification-system",
        "assertions": [
            {
                "name": "uses_feat_type",
                "text": "Uses 'feat' as the commit type",
                "check": lambda text: bool(re.search(r'feat(?:\(|:)', text))
            },
            {
                "name": "mentions_nodemailer",
                "text": "Mentions Nodemailer in the body",
                "check": lambda text: bool(re.search(r'Nodemailer', text, re.IGNORECASE))
            },
            {
                "name": "mentions_tests",
                "text": "Mentions tests in some commit",
                "check": lambda text: bool(re.search(r'(test|unit|spec)', text, re.IGNORECASE))
            },
            {
                "name": "mentions_bull_queue",
                "text": "Mentions Bull job queue",
                "check": lambda text: bool(re.search(r'Bull', text, re.IGNORECASE))
            },
            {
                "name": "valid_cc_format",
                "text": "Follows Conventional Commits format: type(scope): summary",
                "check": lambda text: bool(re.search(r'(fix|feat|docs|chore|refactor|style|test|perf|build|ci|revert)\(?\w*\)?:\s', text))
            },
        ]
    }
]

def grade_run(eval_dir, variant):
    """Grade one run and save grading.json."""
    output_path = os.path.join(eval_dir, variant, "outputs", "output.txt")
    grading_path = os.path.join(eval_dir, variant, "grading.json")

    if not os.path.exists(output_path):
        grading = {"error": f"output.txt not found at {output_path}", "expectations": []}
        with open(grading_path, "w") as f:
            json.dump(grading, f, indent=2)
        return grading

    with open(output_path) as f:
        text = f.read()

    eval_name = os.path.basename(eval_dir)
    eval_config = next((e for e in EVALS if e["eval_name"] == eval_name or f"eval-{e['eval_id']}-{e['eval_name']}" == eval_name), None)

    if not eval_config:
        # Try matching by eval_id from the directory name
        for e in EVALS:
            if str(e["eval_id"]) in eval_name:
                eval_config = e
                break

    if not eval_config:
        grading = {"error": f"No eval config found for {eval_name}", "expectations": []}
        with open(grading_path, "w") as f:
            json.dump(grading, f, indent=2)
        return grading

    expectations = []
    for assertion in eval_config["assertions"]:
        try:
            passed = assertion["check"](text)
        except Exception as exc:
            passed = False
        expectations.append({
            "text": assertion["text"],
            "passed": passed,
            "evidence": f"Found in output: {assertion['text']}" if passed else f"Not found: {assertion['text']}"
        })

    grading = {"expectations": expectations}
    with open(grading_path, "w") as f:
        json.dump(grading, f, indent=2)

    passed_count = sum(1 for e in expectations if e["passed"])
    total = len(expectations)
    print(f"  {eval_name}/{variant}: {passed_count}/{total} passed")
    return grading


def main():
    it_dir = WORKSPACE

    for eval_dir in sorted(os.listdir(it_dir)):
        eval_path = os.path.join(it_dir, eval_dir)
        if not os.path.isdir(eval_path) or eval_dir.startswith(".") or eval_dir == os.path.basename(__file__):
            continue

        for variant in ["with_skill", "without_skill"]:
            grade_run(eval_path, variant)

    print("\nDone grading.")


if __name__ == "__main__":
    main()
