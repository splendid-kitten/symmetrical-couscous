<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';

import axios from 'axios';

const toast = useToast();

const visits = ref(null);
const visitDialog = ref(false);
const deleteVisitDialog = ref(false);
const deleteVisitsDialog = ref(false);
const visit = ref({});
const selectedVisits = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);



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

const openNew = () => {
    visit.value = {};
    submitted.value = false;
    visitDialog.value = true;
};

const hideDialog = () => {
    visitDialog.value = false;
    submitted.value = false;
};

const saveVisit = () => {
    submitted.value = true;
    if (visit.value.name && visit.value.name.trim() && visit.value.price) {
        if (visit.value.id) {
            visit.value.inventoryStatus = visit.value.inventoryStatus.value ? visit.value.inventoryStatus.value : visit.value.inventoryStatus;
            visits.value[findIndexById(visit.value.id)] = visit.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            visit.value.id = createId();
            visit.value.code = createId();
            visit.value.image = 'product-placeholder.svg';
            visit.value.inventoryStatus = visit.value.inventoryStatus ? visit.value.inventoryStatus.value : 'INSTOCK';
            visits.value.push(visit.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        visitDialog.value = false;
        visit.value = {};
    }
};

const editVisit = (editVisit) => {
    visit.value = { ...editVisit };
    console.log(visit);
    visitDialog.value = true;
};

const confirmDeleteVisit = (editVisit) => {
    visit.value = editVisit;
    deleteVisitDialog.value = true;
};

const deleteVisit = () => {
    visits.value = visits.value.filter((val) => val.id !== visit.value.id);
    deleteVisitDialog.value = false;
    visit.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < visits.value.length; i++) {
        if (visits.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const confirmDeleteSelected = () => {
    deleteVisitsDialog.value = true;
};
const deleteSelectedVisits = () => {
    visits.value = visits.value.filter((val) => !selectedVisits.value.includes(val));
    deleteVisitsDialog.value = false;
    selectedVisits.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

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
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedVisits || !selectedVisits.length" />
                            <Button label="GENERATE VISITS" class="mr-2 mb-2" @click="genVisits" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="visits"
                    v-model:selection="selectedVisits"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Visits</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
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
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editVisit(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteVisit(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="visitDialog" :style="{ width: '450px' }" header="Visit Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="visit.name" required="true" autofocus :class="{ 'p-invalid': submitted && !visit.name }" />
                        <small class="p-invalid" v-if="submitted && !visit.name">Name is required.</small>
                    </div>                   
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveVisit" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteVisitDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="visit">Êtes-vous certain de vouloir supprimer cette visite: <b>{{ visit.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteVisitDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteVisit" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteVisitsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="visit">Êtes-vous certain de vouloir supprimer les visites sélectionnées?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteVisitsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedVisits" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
