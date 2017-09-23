
<template>
    <div class="taopin-alljobs-page">        
        <all-jobs></all-jobs>
    </div>
</template>

<script>
    import './style/layout.css'
    import api from 'api/api'
    import allJobs from '../../components/allJobs'
    var Api = new api();

    export default {
        data() {
            return {
                currentStep: 2                                       
            }
        },
        components: {
        	allJobs
        }
    }
</script>
