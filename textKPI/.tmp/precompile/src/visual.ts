
var sFontFamilyHeading: any = ""
var sFontFamily: any = "";

import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;

module powerbi.extensibility.visual.textKPIB6F7AC98CDD04F1AA0FD0BD21EDD4511  {
    interface textKPIViewModel {
        dataPoints: textKPIDataPoint[];
        settings: textKPISettings;
    };

    interface textKPIDataPoint {
        colorIndicator: number;
        textKPI: string;
    };

    interface textKPISettings {
        textKPIColors: {
            colorA: Fill;
            colorB: Fill;
            colorC: Fill;
            colorD: Fill;
            colorText: Fill;
            colorCircle: Fill;
        }
        textFontSize: {
            show: boolean;
            sizeTitle: number;
            sizeTextKPI: number;
        }
        General: {
            textKPITitle: string;
        }


    };




    function visualTransform(options: VisualUpdateOptions, host: IVisualHost, thisRef: Visual): textKPIViewModel {
        let dataViews = options.dataViews;
        let defaultSettings: textKPISettings = {
            textFontSize: {
                show: false,
                sizeTitle: 20,
                sizeTextKPI: 30,
            }
            ,
            textKPIColors: {
                colorA: { solid: { color: "#3FC380" } },
                colorB: { solid: { color: "#ED9C29" } },
                colorC: { solid: { color: "#FC6360" } },
                colorD: { solid: { color: "#AEB9BF" } },
                colorText: { solid: { color: "#ffffff" } },
                colorCircle: { solid: { color: "#ffffff" } }
            }
            ,
            General: {
                textKPITitle: "",
            }
        };
        let viewModel: textKPIViewModel = {
            dataPoints: [],
            settings: <textKPISettings>{},
        };

        if (!dataViews
            || !dataViews[0]
            || !dataViews[0].categorical
            || !dataViews[0].categorical.values
        )
            return viewModel;

        let categorical = dataViews[0].categorical;
        let dataValue = categorical.values[0];

        let objects = dataViews[0].metadata.objects;
        let textkpiSettings: textKPISettings = {
            textFontSize: {
                show: getValue<boolean>(objects, 'textFontSize', 'show', defaultSettings.textFontSize.show),
                sizeTitle: getValue<number>(objects, 'textFontSize', 'psizeTitle', defaultSettings.textFontSize.sizeTitle),
                sizeTextKPI: getValue<number>(objects, 'textFontSize', 'psizeTextKPI', defaultSettings.textFontSize.sizeTextKPI),
            }
            ,
            textKPIColors: {
                colorA: getValue<Fill>(objects, 'textKPIColors', 'pcolorA', defaultSettings.textKPIColors.colorA),
                colorB: getValue<Fill>(objects, 'textKPIColors', 'pcolorB', defaultSettings.textKPIColors.colorB),
                colorC: getValue<Fill>(objects, 'textKPIColors', 'pcolorC', defaultSettings.textKPIColors.colorC),
                colorD: getValue<Fill>(objects, 'textKPIColors', 'pcolorD', defaultSettings.textKPIColors.colorD),
                colorText: getValue<Fill>(objects, 'textKPIColors', 'pcolorText', defaultSettings.textKPIColors.colorText),
                colorCircle: getValue<Fill>(objects, 'textKPIColors', 'pcolorCircle', defaultSettings.textKPIColors.colorCircle)
            }
            ,
            General: {
                textKPITitle: getValue<string>(objects, 'textKPITitle', 'ptextKPITitle', defaultSettings.General.textKPITitle),
            }
        }

        let textkpiDataPoints: textKPIDataPoint[] = [];

        return {
            dataPoints: textkpiDataPoints,
            settings: textkpiSettings,
        };

    }

    export class Visual implements IVisual {
        private host: IVisualHost;
        private updateCount: number;

        private svg: d3.Selection<SVGElement>;

        private dMainGroupElement: d3.Selection<SVGElement>;

        private dBackGround: d3.Selection<SVGElement>;

        private dtextKPITitle: d3.Selection<SVGElement>;
        private dtextKPI: d3.Selection<SVGElement>;
        private dCirle: d3.Selection<SVGElement>;
        private test: HTMLElement;

        public textkpiCurrentSettings: textKPISettings;
        private textkpiDataPoints: textKPIDataPoint[];

        constructor(options: VisualConstructorOptions) {

            this.host = options.host;
            let svg = this.svg = d3.select(options.element)
                .append('svg')
                .classed('textKPI', true);

            this.dMainGroupElement = this.svg.append('g');

            this.dBackGround = this.dMainGroupElement.append("rect");
            this.dtextKPITitle = this.dMainGroupElement.append("text");
            this.dtextKPI = this.dMainGroupElement.append("text");
            this.dCirle = this.dMainGroupElement.append("circle");
        }

        public update(options: VisualUpdateOptions) {
            let viewModel: textKPIViewModel = visualTransform(options, this.host, this);

            let settings = this.textkpiCurrentSettings = viewModel.settings;
            this.textkpiDataPoints = viewModel.dataPoints;

            let width = options.viewport.width;
            let height = options.viewport.height;

            if (this.textkpiDataPoints.length === 0) {
                this.svg.attr("visibility", "hidden");
                return;
            }
            this.svg.attr("visibility", "visible");


            // Limit properties
            this.textkpiCurrentSettings.textFontSize.sizeTitle = this.textkpiCurrentSettings.textFontSize.sizeTitle > 500 ? 500 : this.textkpiCurrentSettings.textFontSize.sizeTitle < 1 ? 1 : this.textkpiCurrentSettings.textFontSize.sizeTitle;
            this.textkpiCurrentSettings.textFontSize.sizeTextKPI = this.textkpiCurrentSettings.textFontSize.sizeTextKPI > 500 ? 500 : this.textkpiCurrentSettings.textFontSize.sizeTextKPI < 1 ? 1 : this.textkpiCurrentSettings.textFontSize.sizeTextKPI;


            // Convert data points to screen 
            var sW = width;
            var sH = height;
            var nW = sW * 0.9;
            var nH = sH * 0.32;
            // End conversion 


            var kpiText = this.textkpiCurrentSettings.General.textKPITitle;


            this.svg.attr({
                'height': height,
                'width': width
            });
            //color setting
            var statusColor = this.textkpiCurrentSettings.textKPIColors.colorD;

            var sL = sH;
            //segement
            var iBox1H = sH * 0.25;
            var iBox2H = sH * 0.75;

            //text color
            var textColor = this.textkpiCurrentSettings.textKPIColors.colorText;
            var circleColor = this.textkpiCurrentSettings.textKPIColors.colorCircle;
            //background rec and color
            this.dBackGround
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", sW)
                .attr("height", sH)
                .attr("fill", statusColor.solid.color);
            //test postion and color
            var iSize = iBox1H * 0.7;

            this.dtextKPITitle
                .attr("x", sW * 0.5)
                .attr("y", iBox1H * 0.75)
                .attr("fill", textColor.solid.color)
                .attr("style", sFontFamilyHeading + "font-size:" + iSize + "px")
                .attr("text-anchor", "middle")
                .text(kpiText);

            // Fix text size
            var el = <SVGTextElement>this.dtextKPITitle.node();
            for (var i = 0; i < 20; i++) {
                if (el.getComputedTextLength() > sW * 0.8) {
                    iSize -= iBox1H * 0.04;
                    this.dtextKPITitle.attr("style", sFontFamily + "font-size:" + iSize + "px");
                }
                else {
                    break;
                }
            }



          



            // Font size (manual)
            if (this.textkpiCurrentSettings.textFontSize.show) {
                this.dtextKPITitle.attr("style", sFontFamily + "font-size:" + this.textkpiCurrentSettings.textFontSize.sizeTextKPI + "px");
            }


            // Line chart
            this.test.innerHTML = `<P>TEST number ${(this.dtextKPI)}</p>`



        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        // Right settings panel
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            if (typeof this.textkpiCurrentSettings.General === 'undefined') {
                return objectEnumeration;
            }

            switch (objectName) {
                case 'textFontSize':
                    objectEnumeration.push({
                        objectName: objectName,
                        displayName: "Text KPI Fonts",
                        properties: {
                            show: this.textkpiCurrentSettings.textFontSize.show,
                            psizeTextKPI: this.textkpiCurrentSettings.textFontSize.sizeTextKPI,
                            psizeTitle: this.textkpiCurrentSettings.textFontSize.sizeTitle,
                        },
                        selector: null
                    });
                    break;
                case 'textKPIColors':
                    objectEnumeration.push({
                        objectName: objectName,
                        displayName: "Text KPI Colors",
                        properties: {
                            pcolorA: this.textkpiCurrentSettings.textKPIColors.colorA,
                            pcolorB: this.textkpiCurrentSettings.textKPIColors.colorB,
                            pcolorC: this.textkpiCurrentSettings.textKPIColors.colorC,
                            pcolorD: this.textkpiCurrentSettings.textKPIColors.colorD,
                            pcolorText: this.textkpiCurrentSettings.textKPIColors.colorText,
                            pcolorCircle: this.textkpiCurrentSettings.textKPIColors.colorCircle
                        },
                        selector: null
                    });
                    break;

                case 'General':
                    objectEnumeration.push({
                        objectName: objectName,
                        displayName: "General",
                        properties: {
                            ptextKPITitle: this.textkpiCurrentSettings.General.textKPITitle,
                        },
                        selector: null
                    });
                    break;
            };

            return objectEnumeration;
        }

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }
}