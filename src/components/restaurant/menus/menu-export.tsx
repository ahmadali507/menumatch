"use client";
import { Button, Menu, MenuItem } from "@mui/material";
import TableViewIcon from '@mui/icons-material/TableView';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useState } from 'react';
import { Menu as MenuType } from "@/types";
import { exportMenuAsCSV, exportMenuAsJSON } from '@/actions/actions.export';
import { useToast } from '@/context/toastContext';
import { pdf } from '@react-pdf/renderer';
import { MenuPDFTemplate } from '@/components/pdf/menu-pdf-template';

interface MenuExportProps {
  menu: MenuType;
}

export default function MenuExport({ menu }: MenuExportProps) {
  const { showToast } = useToast();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadFile = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      if (format === 'pdf') {
        const blob = await pdf(<MenuPDFTemplate menu={menu} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${menu.name.toLowerCase().replace(/\s+/g, '-')}-menu.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Menu exported as PDF successfully', 'success');
      } else {
        const result = format === 'csv'
          ? await exportMenuAsCSV(menu)
          : await exportMenuAsJSON(menu);

        if (result.success && result.data) {
          downloadFile(result.data, result.filename);
          showToast(`Menu exported as ${format.toUpperCase()} successfully`, 'success');
        } else {
          showToast(result.error || `Failed to export menu as ${format.toUpperCase()}`, 'error');
        }
      }
    } catch (error) {
      showToast((error as Error).message || `Error exporting menu as ${format.toUpperCase()}`, 'error');
    }
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        aria-label="export menu"
        aria-controls={open ? 'export-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ maxWidth: "200px" }}
      >
        Export Data
      </Button>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={() => handleExport('csv')} sx={{ gap: 1 }}>
          <TableViewIcon fontSize="small" />
          Export as CSV
        </MenuItem>
        <MenuItem onClick={() => handleExport('json')} sx={{ gap: 1 }}>
          <DataObjectIcon fontSize="small" />
          Export as JSON
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')} sx={{ gap: 1 }}>
          <PictureAsPdfIcon fontSize="small" />
          Export as PDF
        </MenuItem>
      </Menu>
    </>
  );
}