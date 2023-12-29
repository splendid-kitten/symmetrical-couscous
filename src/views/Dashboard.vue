<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

const visits = ref(null);
const totalVisits = ref(null);
const avgVisitDuration = ref(null);

const lineData = reactive({
    labels: [],
    datasets: [
        {
            label: 'Visites par jour',
            data: [],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Visiteurs par jour',
            data: [],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});

const lineOptions = ref(null);

onMounted(() => {
    const fetchData = async () => {
        try {
            const [recentVisitsRes, totalVisitRes, visitorsPerDayRes, visitsPerDayRes, avgVisitDurationRes] = await Promise.all([
                axios.get('/.netlify/functions/fetch-recent-visits'),
                axios.get('/.netlify/functions/get-visits-total-amount'),
                axios.get('/.netlify/functions/get-visitors-per-day'),
                axios.get('/.netlify/functions/get-visits-per-day'),
                axios.get('/.netlify/functions/get-avg-visit-duration')
            ]);

            // Update lineData labels and data with visits per day
            lineData.labels = visitsPerDayRes.data.map(item => item._id);
            lineData.datasets[0].data = visitsPerDayRes.data.map(item => item.count);
            lineData.datasets[1].data = visitorsPerDayRes.data.map(item => item.count);

            // Update Recent Visits
            visits.value = recentVisitsRes.data;

            totalVisits.value = totalVisitRes.data;

            avgVisitDuration.value = avgVisitDurationRes.data;

        } catch (error) {
            console.log('Some wild error')
            console.error(error);
        }
    }
    fetchData();
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<script>
import axios from 'axios';

export default {
    data() {
    return {
      response: null, // Add this line
    };
  },
  methods: {
        async updateData() {
            try {
                const response = await axios.get('/.netlify/functions/hello-world');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async fetchData() {
            try {
                const response = await axios.get('/.netlify/functions/fetch-geoloc');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async fetchVisits() {
            try {
                const response = await axios.get('/.netlify/functions/fetch-visits');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async genVisits() {
            try {
                const response = await axios.get('/.netlify/functions/generate-visit-data');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async getVisitorsPerDay() {
            try {
                const response = await axios.get('/.netlify/functions/get-visitors-per-day');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async getVisitsPerDay() {
            try {
                const response = await axios.get('/.netlify/functions/get-visits-per-day');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async getVisitAvgDuration() {
            try {
                const response = await axios.get('/.netlify/functions/get-avg-visit-duration');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
        async getVisitTotalAmount() {
            try {
                const response = await axios.get('/.netlify/functions/get-visits-total-amount');
                console.log(response.data);
                this.response = response.data;
            } catch (error) {
                console.log('Some wild error')
                console.error(error);
                this.response = error.message;
            }
        },
    }
}
</script>

<template>
  <div class="grid">
      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
              <div class="flex justify-content-between mb-3">
                  <div>
                      <span class="block text-500 font-medium mb-3">Durée moyenne d'une visite</span>
                      <div class="text-900 font-medium text-xl">{{ avgVisitDuration }} secondes</div>
                  </div>
                  <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                      <i class="pi pi-clock text-orange-500 text-xl"></i>
                  </div>
              </div>
          </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
              <div class="flex justify-content-between mb-3">
                  <div>
                      <span class="block text-500 font-medium mb-3">Nombre de visite total</span>
                      <div class="text-900 font-medium text-xl">{{ totalVisits }} visites</div>
                  </div>
                  <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                      <i class="pi pi-user text-cyan-500 text-xl"></i>
                  </div>
              </div>
          </div>
      </div>
      <div class="col-12 xl:col-6">
          <div class="card">
              <h5>Visites récentes</h5>
              <DataTable :value="visits" :rows="5" :paginator="true" responsiveLayout="scroll">
                  <Column field="propulso_id" header="ID" style="width: 35%"></Column>
                  <Column field="lat" header="Latitude" style="width: 35%"></Column>
                  <Column field="lng" header="Longitude" style="width: 35%"></Column>
                  <Column field="start_time" header="Début" :sortable="true" style="width: 35%"></Column>
                  <Column field="end_time" header="Fin" :sortable="true" style="width: 35%"></Column>
                  <Column field="duration" header="Durée" :sortable="true" style="width: 35%"></Column>
                  <Column field="date" header="Date" :sortable="true" style="width: 35%"></Column>
                </DataTable>
          </div>
          
      </div>
      <div class="col-12 xl:col-6">
          <div class="card">
              <h5>Visites et visiteurs quotidiens </h5>
              <Chart type="line" :data="lineData" :options="lineOptions" />
          </div>
      </div>
    </div>
    <div class="card">
        <h5>Serverless Functions</h5>
        <Button label="Run Hello World" class="mr-2 mb-2" @click="updateData" />
        <Button label="Fetch Geoloc" class="mr-2 mb-2" @click="fetchData" />
        <Button label="Fetch Visit" class="mr-2 mb-2" @click="fetchVisits" />
        <Button label="GENERATE VISITS" class="mr-2 mb-2" @click="genVisits" />
    </div>
    <div class="card">
        <h5>Serverless Functions</h5>
        <Button label="Visitors per day" class="mr-2 mb-2" @click="getVisitorsPerDay" />
        <Button label="Visits per day" class="mr-2 mb-2" @click="getVisitsPerDay" />
        <Button label="Avg Duration" class="mr-2 mb-2" @click="getVisitAvgDuration" />
        <Button label="Total Amount" class="mr-2 mb-2" @click="getVisitTotalAmount" />
    </div>

    <div class="card">
        <h5>Response</h5>
        <p>Response: {{ response }}</p>
    </div>

</template>