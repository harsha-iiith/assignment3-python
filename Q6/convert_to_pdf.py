#!/usr/bin/env python3
"""
Convert Report.md to Report.pdf using reportlab.
"""

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Preformatted
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.enums import TA_LEFT, TA_CENTER
    import re

    # Read markdown
    with open('Report.md', 'r') as f:
        content = f.read()

    # Create PDF
    doc = SimpleDocTemplate(
        'Report.pdf',
        pagesize=letter,
        rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18
    )

    styles = getSampleStyleSheet()
    story = []
    
    # Add custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor='#000000',
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )
    
    h3_style = ParagraphStyle(
        'CustomH3',
        parent=styles['Heading3'],
        fontSize=12,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    )
    
    code_style = ParagraphStyle(
        'CustomCode',
        parent=styles['Code'],
        fontSize=8,
        leftIndent=20,
        fontName='Courier'
    )
    
    # Parse markdown
    lines = content.split('\n')
    i = 0
    in_code_block = False
    code_lines = []
    is_first_h1 = True
    
    while i < len(lines):
        line = lines[i]
        
        if line.strip().startswith('```'):
            if in_code_block:
                # End code block
                code_text = '\n'.join(code_lines)
                story.append(Preformatted(code_text, code_style))
                story.append(Spacer(1, 0.1*inch))
                code_lines = []
                in_code_block = False
            else:
                # Start code block
                in_code_block = True
            i += 1
            continue
        
        if in_code_block:
            code_lines.append(line)
            i += 1
            continue
        
        line_stripped = line.strip()
        
        if line_stripped.startswith('# ') and not line_stripped.startswith('## '):
            # H1
            if is_first_h1:
                story.append(Paragraph(line_stripped[2:], title_style))
                story.append(Spacer(1, 0.3*inch))
                is_first_h1 = False
            else:
                story.append(Spacer(1, 0.3*inch))
                story.append(Paragraph(line_stripped[2:], h1_style))
                story.append(Spacer(1, 0.2*inch))
        elif line_stripped.startswith('### '):
            # H3
            story.append(Spacer(1, 0.15*inch))
            story.append(Paragraph(line_stripped[4:], h3_style))
        elif line_stripped.startswith('## '):
            # H2
            story.append(Spacer(1, 0.25*inch))
            story.append(Paragraph(line_stripped[3:], h2_style))
            story.append(Spacer(1, 0.1*inch))
        elif line_stripped.startswith('---'):
            # Horizontal rule
            if len(story) > 0:
                story.append(Spacer(1, 0.2*inch))
        elif line_stripped.startswith('|'):
            # Table line - just add as preformatted
            story.append(Preformatted(line, code_style))
        elif line_stripped:
            # Regular paragraph
            # Convert markdown formatting
            line_html = line_stripped
            # Bold
            line_html = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', line_html)
            # Italic
            line_html = re.sub(r'\*(.+?)\*', r'<i>\1</i>', line_html)
            # Inline code
            line_html = re.sub(r'`(.+?)`', r'<font face="Courier" size="9">\1</font>', line_html)
            # Links [text](url) - just show text
            line_html = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', line_html)
            
            # Handle bullet points
            if line_stripped.startswith('- '):
                line_html = '• ' + line_html[2:]
            elif line_stripped.startswith('* '):
                line_html = '• ' + line_html[2:]
            
            try:
                story.append(Paragraph(line_html, styles['Normal']))
                story.append(Spacer(1, 0.05*inch))
            except Exception as e:
                # If paragraph fails, use preformatted
                story.append(Preformatted(line_stripped, code_style))
                story.append(Spacer(1, 0.05*inch))
        
        i += 1

    # Build PDF
    doc.build(story)
    print('✓ PDF created successfully: Report.pdf')

except ImportError as e:
    print(f'Error: reportlab library not available')
    print(f'Install with: pip install reportlab')
    print(f'\nAlternatively, you can:')
    print(f'1. Use an online markdown-to-PDF converter with Report.md')
    print(f'2. Open Report.md in VS Code and use "Markdown PDF" extension')
    print(f'3. Use pandoc: pandoc Report.md -o Report.pdf')
    exit(1)

except Exception as e:
    print(f'Error creating PDF: {e}')
    import traceback
    traceback.print_exc()
    exit(1)
