#!/usr/bin/env python3
"""
Test runner script for the FastAPI vehicle project.
Supports running all tests or specific test files from the organized test structure.
"""

import sys
import unittest
import os
from pathlib import Path

# Add the project root to Python path

# Add backend and project root to Python path for test discovery
project_root = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(project_root)
sys.path.insert(0, backend_dir)
sys.path.insert(0, os.path.join(project_root, 'vehicle'))


# Test directory configuration
TEST_DIR = os.path.join(project_root, 'vehicle', 'tests')
TEST_PATTERN = '*_test.py'


def discover_all_tests():
    """Discover and return all tests in the test directory."""
    loader = unittest.TestLoader()
    suite = loader.discover(TEST_DIR, pattern=TEST_PATTERN)
    return suite


def discover_specific_test(test_name):
    """Discover and return tests from a specific test file or module."""
    loader = unittest.TestLoader()
    # Handle different test name formats
    if test_name.endswith('_test'):
        module_name = f'{test_name}'
    elif test_name.endswith('_test.py'):
        module_name = f'{test_name[:-3]}'
    elif '.' in test_name:
        module_name = test_name
    else:
        test_files = list(Path(TEST_DIR).glob(f'*{test_name}*.py'))
        if test_files:
            test_file = test_files[0].stem
            module_name = f'{test_file}'
        else:
            module_name = f'{test_name}_test'
    try:
        # Try loading from vehicle.tests.<module>
        suite = loader.loadTestsFromName(f'vehicle.tests.{module_name}')
        return suite
    except (ImportError, AttributeError) as e:
        print(f"Error loading test '{test_name}': {e}")
        print(f"Attempted to load module: vehicle.tests.{module_name}")
        return None


def list_available_tests():
    """List all available test files."""
    test_files = list(Path(TEST_DIR).glob(TEST_PATTERN))
    if test_files:
        print("Available test files:")
        for test_file in sorted(test_files):
            test_name = test_file.stem
            print(f"  - {test_name}")
        print(f"\nUsage examples:")
        print(f"  python run_tests.py                    # Run all tests")
        print(f"  python run_tests.py load_data_test     # Run load_data tests")
        print(f"  python run_tests.py get_a_vehicle_data_test  # Run API endpoint tests")
        print(f"  python run_tests.py --list             # Show this list")
    else:
        print(f"No test files found in {TEST_DIR} with pattern {TEST_PATTERN}")


def run_tests(suite, test_description="tests"):
    """Run the test suite and return success status."""
    if not suite or suite.countTestCases() == 0:
        print(f"No {test_description} found to run.")
        return False
    
    print(f"Running {suite.countTestCases()} {test_description}...")
    print("=" * 60)
    
    runner = unittest.TextTestRunner(verbosity=2, buffer=True)
    result = runner.run(suite)
    
    print("=" * 60)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Skipped: {len(result.skipped)}")
    
    if result.failures:
        print("\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback.split()[-1] if traceback.split() else 'Unknown failure'}")
    
    if result.errors:
        print("\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback.split()[-1] if traceback.split() else 'Unknown error'}")
    
    return result.wasSuccessful()


def main():
    """Main entry point for the test runner."""
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        
        if arg in ['--list', '-l', 'list']:
            list_available_tests()
            return
        elif arg in ['--help', '-h', 'help']:
            print(__doc__)
            list_available_tests()
            return
        else:
            # Run specific test
            suite = discover_specific_test(arg)
            if suite is None:
                print(f"Could not find test: {arg}")
                list_available_tests()
                sys.exit(1)
            success = run_tests(suite, f"tests from '{arg}'")
    else:
        # Run all tests
        suite = discover_all_tests()
        success = run_tests(suite, "tests")
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
