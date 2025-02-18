import { TextField, Autocomplete, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

type LabelSearchProps = {
  onLabelChange: (labels: string[]) => void;
  allLabels: string[];
  selectedLabels: string[];
};

export default function LabelSearch({ onLabelChange, allLabels, selectedLabels }: LabelSearchProps) {
  return (
    <Autocomplete
      multiple
      options={allLabels}
      value={selectedLabels}
      onChange={(_, newValue) => onLabelChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Filter by labels..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <SearchIcon className="mr-2 text-gray-400" />
                {params.InputProps.startAdornment}
              </>
            ),
          }}
          size="small"
          fullWidth
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            size="small"
          />
        ))
      }
    />
  );
}