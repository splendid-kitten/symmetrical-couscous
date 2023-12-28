<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

const visits = ref(null);
const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        }
    ]
});

const lineOptions = ref(null);

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
        }
    }
}
</script>

<template>
  <div class="grid">
      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
              <div class="flex justify-content-between mb-3">
                  <div>
                      <span class="block text-500 font-medium mb-3">Visits Today</span>
                      <div class="text-900 font-medium text-xl">152</div>
                  </div>
                  <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                      <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                  </div>
              </div>
              <span class="text-green-500 font-medium">24 new </span>
              <span class="text-500">since last visit</span>
          </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
              <div class="flex justify-content-between mb-3">
                  <div>
                      <span class="block text-500 font-medium mb-3">Average Visits</span>
                      <div class="text-900 font-medium text-xl">$2.100</div>
                  </div>
                  <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                      <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                  </div>
              </div>
              <span class="text-green-500 font-medium">%52+ </span>
              <span class="text-500">since last week</span>
          </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
              <div class="flex justify-content-between mb-3">
                  <div>
                      <span class="block text-500 font-medium mb-3">Total Visits</span>
                      <div class="text-900 font-medium text-xl">28441</div>
                  </div>
                  <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                      <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                  </div>
              </div>
              <span class="text-green-500 font-medium">520 </span>
              <span class="text-500">newly registered</span>
          </div>
      </div>
      <div class="col-12 xl:col-6">
          <div class="card">
              <h5>Recent Visits</h5>
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
              <h5>Visits Overview</h5>
              <Chart type="line" :data="lineData" :options="lineOptions" />
          </div>
      </div>
    </div>
    <div class="card">
        <h5>Serverless Functions</h5>
        <Button label="Run Hello World" class="mr-2 mb-2" @click="updateData" />
        <Button label="Fetch Geoloc" class="mr-2 mb-2" @click="fetchData" />
        <Button label="Fetch Visit" class="mr-2 mb-2" @click="fetchVisits" />
    </div>

    <div class="card">
        <h5>Response</h5>
        <p>Response: {{ response }}</p>
    </div>

</template>