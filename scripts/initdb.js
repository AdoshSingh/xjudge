const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  statement: {
    type: String,
    required: true,
  },
  examples: [
    {
      input: {
        type: Object,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  constraints: {
    type: [String],
  },
  testcases: {
    type: String,
  },
  program: {
    type: Object,
  },
  solution: {
    type: String,
  },
});

const Question = mongoose.model("question", questionSchema);

(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/xjudge");
    const newQues = {
      statement:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      examples: [
        {
          input: {
            nums: "[2,7,11,15]",
            target: "9",
          },
          output: "[0,1]",
        },
        {
          input: {
            nums: "[3,2,4]",
            target: "6",
          },
          output: "[1,2]",
        },
        {
          input: {
            nums: "[3,3]",
            target: "6",
          },
          output: "[0,1]",
        },
      ],
      constraints: [
        "2 <= nums.length <= 104",
        "-109 <= nums[i] <= 109",
        "-109 <= target <= 109",
        "Only one valid answer exists.",
      ],
      testcases: `2,3,11,15 9\n3,2,4 6\n3,3 6\n`,
      program: {
        javascript: "const fs = require('fs');\\n\\nfunction twoSumSolution(nums, target) {\\n  const map = new Map();\\n  for (let i = 0; i < nums.length; i++) {\\n    const complement = target - nums[i];\\n    if (map.has(complement)) {\\n      return [map.get(complement), i];\\n    }\\n    map.set(nums[i], i);\\n  }\\n  return [];\\n}\\n\\nfunction twoSum(nums, target) {}\\n\\nfunction processTestCases(filePath) {\\n  const fileData = fs.readFileSync(filePath, 'utf8');\\n  const lines = fileData.trim().split('\\\\n');\\n  const results = [];\\n  const expectedResults = [];\\n  for(const line of lines) {\\n    const [numsStr, targetStr] = line.split(' ');\\n    const nums = numsStr.split(',').map(Number);\\n    const target = parseInt(targetStr, 10);\\n    const result = twoSum(nums, target);\\n    const expectedResult = twoSumSolution(nums, target);\\n    results.push(result);\\n    expectedResults.push(expectedResult);\\n  }\\n  return {results, expectedResults};\\n}\\n\\ntry {\\n  const outputs = processTestCases('./testcases.txt');\\n  let results = outputs.results;\\n  let expectedResults = outputs.expectedResults;\\n\\n  let finalResultsOutput = \"\";\\n  let finalExpectedOutput = \"\";\\n\\n  for(const output of results) {\\n    const outputStr = output.join(',');\\n    finalResultsOutput += outputStr + '\\\\n';\\n  }\\n  finalResultsOutput.slice(0, -1);\\n\\n  for(const output of expectedResults) {\\n    const outputStr = output.join(',');\\n    finalExpectedOutput += outputStr + '\\\\n';\\n  }\\n  finalExpectedOutput.slice(0, -1);\\n\\n  console.log('Current:\\\\n' + finalResultsOutput);\\n  console.log('Expected:\\\\n' + finalExpectedOutput);\\n} catch(err) {\\n  console.error(err);\\n}\\n",
        python: "import os\\n\\n        def two_sum_solution(nums, target):\\n          num_map = {}\\n          for i, num in enumerate(nums):\\n            complement = target - num\\n            if complement in num_map:\\n              return [num_map[complement], i]\\n            num_map[num] = i\\n          return []\\n\\n        def two_sum(nums, target):\\n\\n        def process_test_cases(file_path):\\n          if not os.path.exists(file_path):\\n            raise FileNotFoundError(f\"File not found: {file_path}\")\\n          \\n          with open(file_path, 'r') as file:\\n            lines = file.read().strip().split('\\n')\\n          \\n          results = []\\n          for line in lines:\\n            nums_str, target_str = line.split(' ')\\n            nums = list(map(int, nums_str.split(',')))\\n            target = int(target_str)\\n            result = two_sum(nums, target)\\n            results.append(result)\\n          \\n          return results\\n\\n        # Example Usage\\n        try:\\n          outputs = process_test_cases('./testcases.txt')\\n          results = outputs[\"results\"]\\n          expected_results = outputs[\"expectedResults\"]\\n\\n          final_results_output = \"\"\\n          final_expected_output = \"\"\\n\\n          for output in results:\\n            output_str = \",\".join(map(str, output))\\n            final_results_output += output_str + '\\n'\\n          final_results_output = final_results_output.strip()\\n\\n          for output in expected_results:\\n            output_str = \",\".join(map(str, output))\\n            final_expected_output += output_str + '\\n'\\n          final_expected_output = final_expected_output.strip()\\n\\n          print(\"Current:\\n\" + final_results_output)\\n          print(\"Expected:\\n\" + final_expected_output)\\n\\n        except Exception as err:\\n          print(f\"Error: {err}\")\\n",
      },
      solution: `0,1\n1,2\n0,1`,
    };
    await Question.insertMany(newQues);
    console.log('Added data successfully')
  } catch (error) {
    console.error(error)
  } finally {
    await mongoose.disconnect();
  }
})();