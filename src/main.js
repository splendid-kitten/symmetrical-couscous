/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import Ripple from 'primevue/ripple';
import Row from 'primevue/row';
import StyleClass from 'primevue/styleclass';
import Toolbar from 'primevue/toolbar';

import 'primevue/resources/themes/lara-dark-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: true });

app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('Button', Button);
app.component('Card', Card);
app.component('Chart', Chart);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Panel', Panel);
app.component('Row', Row);
app.component('Toolbar', Toolbar);

app.mount('#app');