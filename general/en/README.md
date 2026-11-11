# Machine learning in real companies

> **Current structure of `slides.md` (26 slides):** title, contents, objectives, regression with idealista, clustering with Spotify, the Uber simulator (problem, data, four algorithms step by step, end-to-end example and challenges), conclusions and next steps (Jupyter notebooks and web app, pending), sources and closing. The description below refers to the previous 49-slide series, which remains in git history.

English presentation based on the original InnoIT Slidev template. 12 requested topics are expanded into 15 cases to explain binary, multiclass and multilabel classification separately, and to distinguish regression from forecasting.

## Solution diagrams

49 slides now include 15 case-specific solution diagrams and one integrated BBVA Blue diagram. Each diagram explains data inputs, processing/model steps and the business output. Training and serving are separate where documented. Dashed nodes contain illustrative examples. Published source limits appear in captions and notes. Edit `diagrams.json` to change diagram content and positions. The diagrams use native HTML text and SVG connectors in the local Vue theme, preserving editability.

## View and edit

- Open `presentation.html` for a self-contained offline presentation. Use the arrow keys, F for fullscreen, O for the slide overview and N for speaker notes.
- Open `innoit-real-world-ml.pdf` for the PDF.
- Edit `slides.md` to update the deck. Company source links and teaching notes appear in its HTML comments.
- `cases.json` contains structured case content and source references.

## Slidev

Requires Node.js 22.12+ and pnpm. Run `pnpm install`, then `pnpm dev`. `pnpm build` builds the web version. The self-contained HTML is a portable version of the same slide content and branding, with speaker notes included.

## Evidence

Sources checked 19 October 2026. Deployment status describes the publication period. Advantages, limitations and evaluation guidance are teaching analysis unless explicitly attributed. Architecture details are limited to what each source discloses. The Cabify case comes from its implementation partner with customer testimony. “Multicategoría” is interpreted as multilabel classification.

The original theme, logo, colors and Urbane web fonts are preserved. Keep the supplied font license conditions in mind if distributing publicly. Official BMW and Mango visuals are credited in the notes.

## Company diversity update

The 15 main cases now feature 15 different companies. Uber COTA replaces BBVA transaction categorization, and Google Vids replaces Spotify Gen AI Ads. Spotify remains the clustering example and BBVA Blue remains the agentic case and integrated closing example. The two replacement sources were checked on 20 October 2026.

## Interactive Spotify walkthrough

Solution slide 15 now contains a nine-stage Vue/SVG explorer with computed synthetic data, parameter presets, recursive fitting, XGBoost and TreeSHAP. Open `spotify-clustering.html` for the standalone offline version, or `presentation.html#15` for the embedded version. The PDF preserves the static overview. `spotify-clustering-walkthrough.pdf` contains nine static walkthrough stages. See `SPOTIFY-EXPLORER.md` for controls, computation details, limits and rebuild instructions.

## Interactive idealista walkthrough

Solution slide 19 contains a five-stage Vue/SVG valuation explorer: property, similar homes, regression, estimate and explainability. Change the apartment's attributes to recalculate its comparable properties, fitted linear prediction and an explicitly illustrative 50/50 blend. All homes, zones and prices are synthetic. Open `idealista-valuation.html` for the standalone offline version or `presentation.html#19` in the deck. `idealista-valuation-walkthrough.pdf` provides five static views. See `IDEALISTA-EXPLORER.md` for the published case, teaching choices and rebuild instructions.
