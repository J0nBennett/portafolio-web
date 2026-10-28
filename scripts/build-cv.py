"""Build the English CV from its editable data. Requires reportlab (not part of the website build)."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "docs/cv-en.json").read_text(encoding="utf-8"))
font_dir = Path("C:/Windows/Fonts")
if (font_dir / "calibri.ttf").exists():
    pdfmetrics.registerFont(TTFont("CV", str(font_dir / "calibri.ttf")))
    pdfmetrics.registerFont(TTFont("CV-Bold", str(font_dir / "calibrib.ttf")))
    pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold")
    normal, bold = "CV", "CV-Bold"
else:
    normal, bold = "Helvetica", "Helvetica-Bold"
styles = {
    "body": ParagraphStyle("Body", fontName=normal, fontSize=9.5, leading=12.1, spaceAfter=5, textColor=colors.HexColor("#18212c")),
    "name": ParagraphStyle("Name", fontName=bold, fontSize=23, leading=27, spaceAfter=7),
    "role": ParagraphStyle("Role", fontName=normal, fontSize=11, leading=15, spaceAfter=5),
    "contact": ParagraphStyle("Contact", fontName=normal, fontSize=9, leading=12, spaceAfter=3),
    "section": ParagraphStyle("Section", fontName=bold, fontSize=11, leading=14, spaceBefore=11, spaceAfter=7, keepWithNext=True),
    "job": ParagraphStyle("Job", fontName=bold, fontSize=10, leading=13, spaceBefore=5, spaceAfter=3, keepWithNext=True),
    "period": ParagraphStyle("Period", fontName=normal, fontSize=9, leading=12, spaceAfter=4, keepWithNext=True),
    "bullet": ParagraphStyle("Bullet", fontName=normal, fontSize=9.5, leading=12.1, leftIndent=11, firstLineIndent=-9, spaceAfter=3),
}
story = []
def para(text, style="body"):
    return Paragraph(escape(text), styles[style])
def add(text, style="body"):
    story.append(para(text, style))
def bullets(items):
    for text in items:
        add("• " + text, "bullet")
def job(item):
    story.append(KeepTogether([para(item["title"], "job"), para(item["period"], "period"), para("• " + item["bullets"][0], "bullet")]))
    bullets(item["bullets"][1:])

add(data["name"], "name")
add(data["role"], "role")
add(data["contact"], "contact")
for label, key in [("LinkedIn", "linkedin"), ("Portfolio", "portfolio")]:
    url = data[key]
    story.append(Paragraph(f'{label}: <link href="{escape(url)}" color="#18212c">{escape(url.removeprefix("https://"))}</link>', styles["contact"]))
add("Professional Profile", "section")
add(data["profile"])
add("Technical Skills", "section")
for label, value in data["skills"]:
    story.append(Paragraph(f"<b>{escape(label)}:</b> {escape(value)}", styles["body"]))
add("Quality Assurance Experience", "section")
for item in data["qa"]:
    job(item)

story.append(PageBreak())
add("Artificial Intelligence and QA Implementations", "section")
add(data["aiSummary"])
bullets(data["aiBullets"])
add("Software Development Experience", "section")
job(data["development"])
add("Additional Experience", "section")
for item in data["additional"]:
    job(item)
add("Education", "section")
for line in data["education"]:
    add(line)
add("Certifications and Professional Development", "section")
bullets(data["certifications"])
add("Languages", "section")
add(data["language"])

def footer(canvas, doc):
    canvas.setTitle("Jonathan Camelli - Senior QA | QA Automation - English CV")
    canvas.setAuthor(data["name"])
    canvas.setFont(normal, 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(50, 27, "Jonathan Camelli | Senior QA / QA Automation")
    canvas.drawRightString(A4[0]-50, 27, str(doc.page))

output = ROOT / "public/cv-en.pdf"
SimpleDocTemplate(str(output), pagesize=A4, leftMargin=50, rightMargin=50, topMargin=43, bottomMargin=43).build(story, onFirstPage=footer, onLaterPages=footer)
print(output)
