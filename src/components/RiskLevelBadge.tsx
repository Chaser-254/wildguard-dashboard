import React from 'react';
import { RiskLevel } from '../types';
import { getRiskLevelColor, getRiskLevelText } from '../utils/riskAssessment';
interface RiskLevelBadgeProps {
  riskLevel: RiskLevel;
  showIcon?: boolean;
}
export function RiskLevelBadge({
  riskLevel,
  showIcon = true
}: RiskLevelBadgeProps) {
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRiskLevelColor(riskLevel)}`}>
      {showIcon && getRiskLevelText(riskLevel)}
      {!showIcon && riskLevel}
    </span>;
}