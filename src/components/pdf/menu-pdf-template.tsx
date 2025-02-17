import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Menu as MenuType } from "@/types";
import { convert } from 'html-to-text';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2pt solid #333',
    paddingBottom: 15,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  menuDates: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    breakInside: 'avoid',
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#2a2a2a',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    color: '#ffffff',
    textAlign: 'center',
  },
  item: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1pt solid #ddd',
    breakInside: 'avoid',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    padding: '4 8',
    borderRadius: 4,
  },
  itemDescription: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    lineHeight: 1.3,
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    fontStyle: 'italic',
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  label: {
    fontSize: 9,
    backgroundColor: '#f0f7ff',
    color: '#0066cc',
    padding: '2 6',
    borderRadius: 3,
    marginRight: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTop: '1pt solid #ddd',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: '4 8',
    borderRadius: 4,
  },
});

// Helper function to convert HTML to plain text
const convertHtmlToText = (html: string): string => {
  try {
    return convert(html || '', {
      wordwrap: false, // Disable word wrap for single line
      preserveNewlines: false, // Remove line breaks
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } },
        { 
          selector: 'p',
          format: 'inline' // Use inline format instead of paragraph
        }
      ]
    }).replace(/\s+/g, ' ').trim(); // Clean up extra spaces
  } catch (error) {
    console.error('Error converting HTML to text:', error);
    return html || '';
  }
};

export function MenuPDFTemplate({ menu }: { menu: MenuType }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.menuTitle}>{menu.name}</Text>
          <Text style={styles.menuDates}>
            Available from {new Date(menu.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} to {new Date(menu.endDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {menu.sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            {section.items.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${Number(item.price).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.itemDescription}>
                  {convertHtmlToText(item.description)}
                </Text>
                {item.labels && item.labels.length > 0 && (
                  <View style={styles.labels}>
                    {item.labels.map((label) => (
                      <Text key={label} style={styles.label}>
                        {label}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
        <Text style={styles.footer}>
          {menu.name} - Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}