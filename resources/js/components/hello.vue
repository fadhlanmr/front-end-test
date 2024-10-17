<template>
  <div>
    <label>{{ label }}</label>
    <select v-model="selectedOption">
      <option v-for="(option, index) in options" :key="index" :value="option">
        {{ option }}
      </option>
    </select>
    <p>Selected: {{ selectedOption }}</p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "Select an option"
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedOption: ""
    };
  }
};
</script>

<style scoped>
select {
  margin: 10px;
  padding: 5px;
  font-size: 16px;
}
</style>
