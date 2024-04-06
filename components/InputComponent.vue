<!-- text, checkbox, email, file, image, number, password, , tel, url, search, radio, button-->

<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="id">{{ label }}</label>
    <component
        :is="inputComponent"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event)"
        :id="id"
    >
      <slot></slot> <!-- For additional content like options in a select -->
    </component>
    <span v-if="helpText">{{ helpText }}</span>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    modelValue: [String, Number, Boolean, Array, Object, File],
    label: String,
    helpText: String,
    wrapperClass: String,
    id: String
  },
  computed: {
    inputComponent() {
      switch (this.type) {
        case 'textarea':
          return 'textarea';
        case 'select':
          return 'select';
        default:
          return 'input';
      }
    }
  }
};
</script>
