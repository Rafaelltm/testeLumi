import React from "react";
import "./styles.css";

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, ...props }) => {
  return (
    <select className="custom-select" {...props}>
      <option value="">Selecione uma opção</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;