import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Button } from "../../styles/GlobalStyles";
import { QUESTION_STATUS } from "../../utils/constants";

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
  white-space: nowrap;
`;

const StatusButton = styled(Button)`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.fontSizes.sm};
  border-radius: ${theme.borderRadius.full};

  ${(props) => {
    if (props.active) {
      switch (props.status) {
        case "all":
          return `
            background: ${theme.colors.primary};
            color: white;
          `;
        case "unanswered":
          return `
            background: ${theme.colors.warning};
            color: white;
          `;
        case "answered":
          return `
            background: ${theme.colors.success};
            color: white;
          `;
        case "important":
          return `
            background: ${theme.colors.danger};
            color: white;
          `;
        default:
          return `
            background: ${theme.colors.primary};
            color: white;
          `;
      }
    } else {
      return `
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.muted};
        
        &:hover {
          background: ${theme.colors.background};
        }
      `;
    }
  }}
`;

const StudentSearch = styled.input`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.muted};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

const QuestionCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-left: auto;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
`;

const CountBadge = styled.span`
  background: ${(props) => {
    switch (props.type) {
      case "total":
        return theme.colors.primary;
      case "unanswered":
        return theme.colors.warning;
      case "answered":
        return theme.colors.success;
      case "important":
        return theme.colors.danger;
      default:
        return theme.colors.muted;
    }
  }};
  color: white;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  min-width: 20px;
  text-align: center;
`;

const ClearButton = styled(Button)`
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  font-size: ${theme.fontSizes.sm};
`;

const QuestionFilters = ({
  statusFilter,
  studentFilter,
  onStatusFilterChange,
  onStudentFilterChange,
  onClearFilters,
  questionCounts = {
    total: 0,
    unanswered: 0,
    answered: 0,
    important: 0,
  },
}) => {
  const [localStudentFilter, setLocalStudentFilter] = useState(
    studentFilter || ""
  );

  const handleStudentSearchChange = (e) => {
    const value = e.target.value;
    setLocalStudentFilter(value);

    // Debounce the search to avoid too many calls
    clearTimeout(handleStudentSearchChange.timeoutId);
    handleStudentSearchChange.timeoutId = setTimeout(() => {
      onStudentFilterChange(value);
    }, 300);
  };

  const handleClearFilters = () => {
    setLocalStudentFilter("");
    onClearFilters();
  };

  const statusOptions = [
    { key: "all", label: "All Questions", count: questionCounts.total },
    {
      key: QUESTION_STATUS.UNANSWERED,
      label: "Unanswered",
      count: questionCounts.unanswered,
    },
    {
      key: QUESTION_STATUS.ANSWERED,
      label: "Answered",
      count: questionCounts.answered,
    },
    {
      key: QUESTION_STATUS.IMPORTANT,
      label: "Important",
      count: questionCounts.important,
    },
  ];

  const hasActiveFilters = statusFilter !== "all" || studentFilter;

  return (
    <FiltersContainer>
      <FilterGroup>
        <FilterLabel>Filter by Status:</FilterLabel>
        {statusOptions.map((option) => (
          <StatusButton
            key={option.key}
            status={option.key}
            active={statusFilter === option.key}
            onClick={() => onStatusFilterChange(option.key)}
            size="sm"
          >
            {option.label} ({option.count})
          </StatusButton>
        ))}
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Search Student:</FilterLabel>
        <StudentSearch
          type="text"
          placeholder="Enter student name..."
          value={localStudentFilter}
          onChange={handleStudentSearchChange}
        />
      </FilterGroup>

      {hasActiveFilters && (
        <ClearButton variant="outline" size="sm" onClick={handleClearFilters}>
          Clear Filters
        </ClearButton>
      )}

      <QuestionCount>
        <span>Total:</span>
        <CountBadge type="total">{questionCounts.total}</CountBadge>

        <span>Unanswered:</span>
        <CountBadge type="unanswered">{questionCounts.unanswered}</CountBadge>

        <span>Answered:</span>
        <CountBadge type="answered">{questionCounts.answered}</CountBadge>

        <span>Important:</span>
        <CountBadge type="important">{questionCounts.important}</CountBadge>
      </QuestionCount>
    </FiltersContainer>
  );
};

export default QuestionFilters;
