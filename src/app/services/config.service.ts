import { Service } from '@angular/core';

@Service()
export class ConfigService {


    get config() {

        return {
            defaultYear: 2026,
            years: [2026, 2025, 2024],
            commanders: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjL_LcidTbTef4uSyu2qVzINpugpHtaHxTMv5KIoTWy9M297iOmri_lJv-xLnIz5bmich8XtO0zrax/pub?gid=1849510088&single=true&output=csv",
            data: {
                2026: {
                    "type": "google",
                    "games": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjL_LcidTbTef4uSyu2qVzINpugpHtaHxTMv5KIoTWy9M297iOmri_lJv-xLnIz5bmich8XtO0zrax/pub?gid=1675252690&single=true&output=csv",
                }
            }
        };
    }
}
