import { definePreset } from "@primeuix/themes";
import Aura from '@primeuix/themes/aura';
import Material from '@primeuix/themes/material';

export const MyPreset = definePreset(Aura, {
    components: {
        fieldset: {
            legend: { background: '{primary.700}' }
        },
        datatable: {

            headerCell: {
                background: '{surface.700}',



            },




        }
    },


});
