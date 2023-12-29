<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';

import axios from 'axios';

const visits = ref(null);
const dt = ref(null);
const filters = ref({});

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('/.netlify/functions/fetch-visits');
            console.log(response.data);
            visits.value = response.data;
        } catch (error) {
            console.log('Some wild error')
            console.error(error);
        }
    }
    fetchData();
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<script>
    export default {
        data() {
        return {
        response: null, // Add this line
        };
    },
    methods: {
            async genVisits() {
                try {
                    const response = await axios.get('/.netlify/functions/generate-visit-data');
                    console.log(response.data);
                } catch (error) {
                    console.log('Some wild error')
                    console.error(error);
                }
            }
        }
    }
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Générer les visites" class="mr-2" @click="genVisits" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="visits"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="{first} à {last} de {totalRecords} visites"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Tableau des visites</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Rechercher..." />
                            </span>
                        </div>
                    </template>

                    <Column field="propulso_id" header="ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.propulso_id }}
                        </template>
                    </Column>
                    <Column field="lat" header="Latitude" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Latitude</span>
                            {{ slotProps.data.lat }}
                        </template>
                    </Column>
                    <Column field="lng" header="Longitude" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Longitude</span>
                            {{ slotProps.data.lng }}
                        </template>
                    </Column>
                    <Column field="start_time" header="Début" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Début</span>
                            {{ slotProps.data.start_time }}
                        </template>
                    </Column>
                    <Column field="end_time" header="Fin" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fin</span>
                            {{ slotProps.data.end_time }}
                        </template>
                    </Column>
                    <Column field="ping_count" header="Pings" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Pings</span>
                            {{ slotProps.data.ping_count }}
                        </template>
                    </Column>
                    <Column field="duration" header="Durée" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Durée</span>
                            {{ slotProps.data.duration }}
                        </template>
                    </Column>
                    <Column field="date" header="Date" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
