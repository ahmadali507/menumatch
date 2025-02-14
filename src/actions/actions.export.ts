'use server'

import { Menu } from "@/types"

export async function exportMenuAsCSV(menu: Menu) {
  try {
    // Convert menu sections and items to CSV format
    const rows = menu.sections.flatMap(section =>
      section.items.map(item => ({
        section: section.name,
        name: item.name,
        price: item.price,
        description: item.description,
      }))
    );

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(row =>
        [row.section, row.name, row.price, row.description].join(',')
      )
    ].join('\n');

    return {
      success: true,
      data: csv,
      filename: `menu-${menu.name}-${new Date().toISOString().split('T')[0]}.csv`
    };
  } catch (error) {
    console.error('Error exporting menu as CSV:', error);
    return { success: false, error: 'Failed to export menu as CSV' };
  }
}

export async function exportMenuAsJSON(menu: Menu) {
  try {
    const data = JSON.stringify(menu, null, 2);
    return {
      success: true,
      data,
      filename: `menu-${menu.name}-${new Date().toISOString().split('T')[0]}.json`
    };
  } catch (error) {
    console.error('Error exporting menu as JSON:', error);
    return { success: false, error: 'Failed to export menu as JSON' };
  }
}