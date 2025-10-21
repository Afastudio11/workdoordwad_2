import fs from 'fs';
import path from 'path';

export interface TestResult {
  testCase: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
}

export interface TestReport {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  successRate: number;
  criticalIssues: Array<{
    title: string;
    description: string;
    steps: string[];
    expected: string;
    actual: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  performanceMetrics: {
    averagePageLoad: number;
    slowestPage: string;
    apiResponseTime: number;
  };
}

export class ReportGenerator {
  private results: TestResult[] = [];
  private criticalIssues: TestReport['criticalIssues'] = [];

  addResult(result: TestResult) {
    this.results.push(result);
  }

  addCriticalIssue(issue: TestReport['criticalIssues'][0]) {
    this.criticalIssues.push(issue);
  }

  generateMarkdownReport(): string {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0';

    let report = `# E2E Test Report - Pintu Kerja Website\n\n`;
    report += `## Executive Summary\n`;
    report += `- **Total Test Cases**: ${total}\n`;
    report += `- **Passed**: ${passed} ✅\n`;
    report += `- **Failed**: ${failed} ❌\n`;
    report += `- **Skipped**: ${skipped} ⏭️\n`;
    report += `- **Success Rate**: ${successRate}%\n\n`;

    if (this.criticalIssues.length > 0) {
      report += `## Critical Issues Found\n\n`;
      this.criticalIssues.forEach((issue, index) => {
        report += `### ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.title}\n\n`;
        report += `**Description**: ${issue.description}\n\n`;
        report += `**Steps to reproduce**:\n`;
        issue.steps.forEach((step, i) => {
          report += `${i + 1}. ${step}\n`;
        });
        report += `\n`;
        report += `**Expected result**: ${issue.expected}\n\n`;
        report += `**Actual result**: ${issue.actual}\n\n`;
        report += `---\n\n`;
      });
    }

    report += `## Test Results by Module\n\n`;
    
    const moduleGroups = this.groupByModule();
    Object.entries(moduleGroups).forEach(([module, tests]) => {
      report += `### ${module}\n\n`;
      tests.forEach(test => {
        const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⚠️';
        report += `${icon} ${test.testCase} (${test.duration}ms)\n`;
        if (test.error) {
          report += `   - Error: ${test.error}\n`;
        }
      });
      report += `\n`;
    });

    report += `## Recommendations\n\n`;
    report += `1. **Priority 1 (Critical)**: Fix all failed authentication flows\n`;
    report += `2. **Priority 2 (High)**: Optimize slow page loads (>3s)\n`;
    report += `3. **Priority 3 (Medium)**: Improve mobile responsiveness\n`;
    report += `4. **Priority 4 (Low)**: Enhance user feedback messages\n\n`;

    report += `## Test Environment\n`;
    report += `- **Test Date**: ${new Date().toISOString()}\n`;
    report += `- **Browser**: Chromium, Firefox, WebKit\n`;
    report += `- **Test Framework**: Playwright\n`;

    return report;
  }

  private groupByModule(): Record<string, TestResult[]> {
    const groups: Record<string, TestResult[]> = {};
    
    this.results.forEach(result => {
      const module = result.testCase.split(' - ')[0] || 'Other';
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(result);
    });

    return groups;
  }

  saveReport(outputPath: string) {
    const markdown = this.generateMarkdownReport();
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`Test report saved to ${outputPath}`);
  }
}
