<template>
    <div class="vtl vtl-card table-lite-component">
      <div class="vtl-card-title" v-if="title">{{ title }}</div>
      <div class="vtl-card-body">
        <div class="vtl-row">
          <div
            class="col-sm-12"
            :class="{
              'fixed-first-column': isFixedFirstColumn,
              'fixed-first-second-column': isFixedFirstColumn && hasCheckbox,
            }"
          >
            <div v-if="isLoading" class="vtl-loading-mask">
              <div class="vtl-loading-content">
                <span style="color: white">{{ 'Loading...' }}</span>
              </div>
            </div>
            <table
              class="vtl-table vtl-table-hover vtl-table-bordered vtl-table-responsive vtl-table-responsive-sm"
              ref="localTable"
              :style="'max-height: ' + maxHeight + 'px;'"
            >
              <thead class="vtl-thead">
                <tr class="vtl-thead-tr">
                  <th v-if="hasCheckbox" class="vtl-thead-th vtl-checkbox-th">
                    <div>
                      <input
                        type="checkbox"
                        class="vtl-thead-checkbox"
                        v-model="setting.isCheckAll"
                      />
                    </div>
                  </th>
                  <th
                    v-for="(col, index) in columns"
                    class="vtl-thead-th"
                    :class="[col.headerClasses, {'no-resizable': col.noResizable}]"
                    :key="index"
                    :style="
                      Object.assign(
                        {
                          minWidth: col.width ? col.width : 'auto',
                        },
                        col.headerStyles
                      )
                    "
                  >
                    <div
                      class="vtl-thead-column"
                      :class="{
                        'vtl-sortable': col.sortable,
                        'vtl-both': col.sortable,
                        'vtl-asc': setting.order === col.field && setting.sort === 'asc',
                        'vtl-desc': setting.order === col.field && setting.sort === 'desc',
                      }"
                      @click.prevent="col.sortable ? doSort(col.field) : false"
                    >
                      <span>{{ col.label }}</span>
                      <span class="thead-icon" v-if="setting.order === col.field && setting.sort === 'asc' && setting.sortCount.includes(col.field)">
                        <img src="@/assets/icons/commonIcons/arrow-up-light.svg" :alt="'Arrow up icon'">
                      </span>
                      <span class="thead-icon" v-if="setting.order === col.field && setting.sort === 'desc' && setting.sortCount.includes(col.field)">
                        <img src="@/assets/icons/commonIcons/arrow-down-light.svg" :alt="'Arrow down icon'">
                      </span>
                      <span class="thead-icon" v-if="col.sortable && !setting.sortCount.includes(col.field)">
                        <img src="@/assets/icons/commonIcons/arrow-up-light.svg" :alt="'Arrow up icon'" class="couple-icon">
                        <img src="@/assets/icons/commonIcons/arrow-down-light.svg" :alt="'Arrow down icon'" class="couple-icon">
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <template v-if="rows.length > 0">
                <tbody v-if="totalsRowData && isTotalOnTop" class="total-row">
                <tr>
                  <td v-for="(col, index) in columns"
                      :key="index"
                      class="no-resizable">
                    {{ totalsRowData[col.field] }}
                    <select-option-component
                        v-if="col.field === 'status'"
                        :options="statusTypes"
                        :is-lite="true"
                        :is-search-visible="false"
                        :is-select-all-visible="false"
                        :is-border="false"
                        :is-small-options="true"
                        :lite-placeholder="statusType.includes('all')
                        ? $t('filters.all') : $t('lowercase_selected')"
                        class="table-lite-select"
                        @apply-called="$emit('getList')"
                        v-model="statusType"
                    />
                  </td>
                </tr>
                </tbody>
                <tbody
                  v-if="isStaticMode"
                  class="vtl-tbody"
                  :set="(templateRows = groupingKey == '' ? [localRows] : localRows)"
                >
                  <template
                    v-for="(rows, groupingIndex) in templateRows"
                    :key="groupingIndex"
                  >
                    <tr v-if="groupingKey != ''" class="vtl-tbody-tr vtl-group-tr">
                      <td
                        :colspan="hasCheckbox ? columns.length + 1 : columns.length"
                        class="vtl-tbody-td vtl-group-td"
                      >
                        <div class="flex">
                          <div v-if="hasGroupToggle" class="animation">
                            <a
                              :ref="(el) => (toggleButtonRefs[groupingIndex] = el)"
                              class="cursor-pointer"
                              @click.prevent="toggleGroup(groupingIndex)"
                              >{{ '▼' }}</a
                            >
                          </div>
                          <div
                            class="ml-2"
                            v-html="
                              groupingDisplay
                                ? groupingDisplay(groupingIndex)
                                : groupingIndex
                            "
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      v-for="(row, i) in rows"
                      :key="row[setting.keyColumn] ? row[setting.keyColumn] : i"
                      :ref="
                        (el) => {
                          if (!groupingRowsRefs[groupingIndex]) {
                            groupingRowsRefs[groupingIndex] = [];
                          }
                          groupingRowsRefs[groupingIndex][i] = el;
                        }
                      "
                      :name="'vtl-group-' + groupingIndex"
                      class="vtl-tbody-tr"
                      :class="
                        typeof rowClasses === 'function' ? rowClasses(row) : rowClasses
                      "
                      @mouseenter="addHoverClassToTr"
                      @mouseleave="removeHoverClassFromTr"
                      @click="$emit('row-clicked', row)"
                    >
                      <td v-if="hasCheckbox" class="vtl-tbody-td vtl-checkbox-td">
                        <div>
                          <input
                            type="checkbox"
                            class="vtl-tbody-checkbox"
                            :ref="
                              (el) => {
                                rowCheckbox.push(el);
                              }
                            "
                            :value="row[setting.keyColumn]"
                            @click="checked(row, $event)"
                          />
                        </div>
                      </td>
                      <td
                        v-for="(col, j) in columns"
                        :key="j"
                        class="vtl-tbody-td"
                        :class="[col.columnClasses, {'no-resizable': col.noResizable}]"
                        :style="
                          Object.assign(
                            {
                              width: col.width,
                              maxWidth: col.maxWidth ?? '100%'
                            },
                            col.columnStyles
                          )
                        "
                      >
                        <div v-if="col.display" v-html="col.display(row)"></div>
                        <div v-else>
                          <div v-if="setting.isSlotMode && slots[col.field]">
                            <slot :name="col.field" :value="row"></slot>
                          </div>
                          <span v-else>{{ row[col.field] }}</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tbody
                  v-else
                  class="vtl-tbody"
                  :set="(templateRows = groupingKey == '' ? [rows] : groupingRows)"
                >
                  <template
                    v-for="(rows, groupingIndex) in templateRows"
                    :key="groupingIndex"
                  >
                    <tr v-if="groupingKey != ''" class="vtl-tbody-tr vtl-group-tr">
                      <td
                        :colspan="hasCheckbox ? columns.length + 1 : columns.length"
                        class="vtl-tbody-td vtl-group-td"
                      >
                        <div class="flex">
                          <div v-if="hasGroupToggle" class="animation">
                            <a
                              :ref="(el) => (toggleButtonRefs[groupingIndex] = el)"
                              class="cursor-pointer"
                              @click.prevent="toggleGroup(groupingIndex)"
                              >{{ '▼' }}</a
                            >
                          </div>
                          <div
                            class="ml-2"
                            v-html="
                              groupingDisplay
                                ? groupingDisplay(groupingIndex)
                                : groupingIndex
                            "
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr
                      v-for="(row, i) in rows"
                      :ref="
                        (el) => {
                          if (!groupingRowsRefs[groupingIndex]) {
                            groupingRowsRefs[groupingIndex] = [];
                          }
                          groupingRowsRefs[groupingIndex][i] = el;
                        }
                      "
                      :name="'vtl-group-' + groupingIndex"
                      :key="row[setting.keyColumn] ? row[setting.keyColumn] : i"
                      class="vtl-tbody-tr"
                      :class="
                        typeof rowClasses === 'function' ? rowClasses(row) : rowClasses
                      "
                      @mouseenter="addHoverClassToTr"
                      @mouseleave="removeHoverClassFromTr"
                      @click="$emit('row-clicked', row)"
                    >
                      <td v-if="hasCheckbox" class="vtl-tbody-td vtl-checkbox-td">
                        <div>
                          <input
                            type="checkbox"
                            class="vtl-tbody-checkbox"
                            :ref="
                              (el) => {
                                rowCheckbox.push(el);
                              }
                            "
                            :value="row[setting.keyColumn]"
                            @click="checked(row, $event)"
                          />
                        </div>
                      </td>
                      <td
                        v-for="(col, j) in columns"
                        :key="j"
                        class="vtl-tbody-td"
                        :class="[col.columnClasses, {'no-resizable': col.noResizable}]"
                        :style="
                          Object.assign(
                            {
                              width: col.width,
                              maxWidth: col.maxWidth ?? '100%'
                            },
                            col.columnStyles
                          )
                        "
                      >
                        <div v-if="col.display" v-html="col.display(row)"></div>
                        <div v-else>
                          <div v-if="setting.isSlotMode && slots[col.field]">
                            <slot :name="col.field" :value="row"></slot>
                          </div>
                          <span v-else>{{ row[col.field] }}</span>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tfoot v-if="totalsRowData && !isTotalOnTop" class="total-row">
                  <tr>
                    <td v-for="(col, index) in columns" :key="index">
                    {{ totalsRowData[col.field] }}
                    </td>
                  </tr>
                </tfoot>
              </template>
            </table>
          </div>
        </div>
        <div class="vtl-paging vtl-row pagination-controls d-flex justify-content-between" v-if="rows.length > 0">
          <template v-if="!setting.isHidePaging">
            <div class="vtl-paging-pagination-div">
              <div class="dataTables_paginate">
                <ul class="vtl-paging-pagination-ul vtl-pagination">
                  <li
                      class="vtl-paging-pagination-page-li vtl-paging-pagination-page-li-prev page-item"
                      :class="{ disabled: setting.page <= 1 }"
                  >
                    <a
                        class="vtl-paging-pagination-page-link vtl-paging-pagination-page-link-prev page-link cursor-pointer"
                        :aria-label="'Previous'"
                        @click.prevent="prevPage"
                    >
                      <span aria-hidden="true"><font-awesome-icon icon="fa-solid fa-chevron-left" /></span>
                      <span class="sr-only">{{ 'Prev' }}</span>
                    </a>
                  </li>
                  <li
                      class="vtl-paging-pagination-page-li vtl-paging-pagination-page-li-number page-item"
                      v-for="n in setting.paging"
                      :key="n"
                      :class="{ 'disabled-page': setting.page === n }"
                      v-show="simplePagination"
                  >
                    <a
                        class="vtl-paging-pagination-page-link vtl-paging-pagination-page-link-number page-link cursor-pointer"
                        @click.prevent="movePage(n)"
                    >{{ n }}</a
                    >
                  </li>
                  <li
                      class="vtl-paging-pagination-page-li vtl-paging-pagination-page-li-next page-item"
                      :class="{ disabled: setting.page >= setting.maxPage }"
                  >
                    <a
                        class="vtl-paging-pagination-page-link vtl-paging-pagination-page-link-next page-link cursor-pointer"
                        :aria-label="'Next'"
                        @click.prevent="nextPage"
                    >
                      <span aria-hidden="true"><font-awesome-icon icon="fa-solid fa-chevron-right" /></span>
                      <span class="sr-only">{{ 'Next' }}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="goto-page-container">
                <span class="vtl-paging-page-label">{{messages.goToPageLabel}}</span>
                <input
                    type="number"
                    v-model="setting.page"
                />
              </div>
            </div>
            <div v-if="simplePagination" class="vtl-paging-change-div">
              <select class="vtl-paging-count-dropdown" v-model="setting.pageSize">
                <option
                    v-for="pageOption in pageOptions"
                    :value="pageOption.value"
                    :key="pageOption.value"
                >
                  {{ pageOption.text }}
                </option>
              </select>
            </div>
          </template>
        </div>
        <div class="vtl-row" v-else>
          <div class="vtl-empty-msg col-sm-12 text-center">
            {{ messages.noDataAvailable }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {
      defineComponent,
      ref,
      reactive,
      computed,
      watch,
      onBeforeUpdate,
      nextTick,
      onMounted,
  } from 'vue';
  import {limiter} from '@/lib/helpers/generalHelpers/inputNumberLimiter';
  import SelectOptionComponent from '@/components/common/SelectOptionComponent.vue';
  import {statusTypes} from '@/lib/constants/campaign/status/status';
  import {mapFields} from 'vuex-map-fields';
  
  export default defineComponent({
      name: 'TableLiteComponent',
      components: {
          SelectOptionComponent
      },
      data() {
          return {
              statusTypes
          };
      },
      computed: {
          ...mapFields('campaignList', ['statusType'])
      },
      watch: {
          statusType(val) {
              if(val.includes('all')) {
                  val.shift('all');
              }
  
              if(!val.length) {
                  val.push('all');
              }
          }
      },
      emits: [
          'return-checked-rows',
          'do-search',
          'is-finished',
          'get-now-page',
          'row-clicked',
          'row-toggled',
      ],
      props: {
      // (is data loading)
          isLoading: {
              type: Boolean,
              require: true,
          },
          // (Whether to perform a re-query)
          isReSearch: {
              type: Boolean,
              require: true,
          },
          // Checkbox (Presence of Checkbox)
          hasCheckbox: {
              type: Boolean,
              default: false,
          },
          // Checkbox (Returns data type for checked of Checkbox)
          checkedReturnType: {
              type: String,
              default: 'key',
          },
          // (title)
          title: {
              type: String,
              default: '',
          },
          // (Fixed first column's position)
          isFixedFirstColumn: {
              type: Boolean,
              default: false,
          },
          // (Field)
          columns: {
              type: Array,
              default: () => [],
          },
          // (data)
          rows: {
              type: Array,
              default: () => [],
          },
          // (data row classes)
          rowClasses: {
              type: [Array, Function],
              default: () => [],
          },
          // (Display the number of items on one page)
          pageSize: {
              type: Number,
              default: 10,
          },
          // (Total number of transactions)
          total: {
              type: Number,
              default: 100,
          },
          // (Current page number)
          page: {
              type: Number,
              default: 1,
          },
          // (Sort condition)
          sortable: {
              type: Object,
              default: () => {
                  return {
                      // order: 'id',
                      // sort: 'asc',
                  };
              },
          },
          // (Display text)
          messages: {
              type: Object,
              default: () => {
                  return {
                      pagingInfo: '{0}-{1} / {2}',
                      pageSizeChangeLabel: 'Row count:',
                      gotoPageLabel: 'Go to page:',
                      noDataAvailable: 'No data',
                  };
              },
          },
          // (Static mode(no refresh server data))
          isStaticMode: {
              type: Boolean,
              default: false,
          },
          // (V-slot mode)
          isSlotMode: {
              type: Boolean,
              default: false,
          },
          // (Hide paging)
          isHidePaging: {
              type: Boolean,
              default: false,
          },
          // (Dropdown of Display the number of items on one page)
          pageOptions: {
              type: Array,
              default: () => [
                  {
                      value: 10,
                      text: 10,
                  },
                  {
                      value: 25,
                      text: 25,
                  },
                  {
                      value: 50,
                      text: 50,
                  },
              ],
          },
          // (Key of grouping)
          groupingKey: {
              type: String,
              default: '',
          },
          // (Has hide group rows toggle)
          hasGroupToggle: {
              type: Boolean,
              default: false,
          },
          // (Customize grouping title)
          groupingDisplay: {
              type: Function,
              default: null,
          },
          // (Table's max height)
          maxHeight: {
              default: 'auto',
          },
          // (Grouping collapsed on start)
          startCollapsed: {
              type: Boolean,
              default: false,
          },
          // (Keep collapsed status after refresh)
          isKeepCollapsed: {
              type: Boolean,
              default: false,
          },
          simplePagination: {
              type: Boolean,
              default: true,
          },
          totalsRowData: {
              type: Object,
              default: () => {}
          },
          isTotalOnTop: {
              type: Boolean,
              default: false,
          },
          resizable: {
              type: Boolean,
              default: false
          }
      },
      setup(props, { emit, slots }) {
          let localTable = ref(null);
  
          // (Validate dropdown's values have page-size value or not)
          let defaultPageSize =
        props.pageOptions.length > 0
            ? ref(props.pageOptions[0].value)
            : ref(props.pageSize);
          if (props.pageOptions.length > 0) {
              props.pageOptions.forEach((v) => {
                  if (
                      Object.prototype.hasOwnProperty.call(v, 'value') &&
            Object.prototype.hasOwnProperty.call(v, 'text') &&
            props.pageSize == v.value
                  ) {
                      defaultPageSize.value = v.value;
                  }
              });
          }
  
          // (Internal set value for components)
          const setting = reactive({
              sortCount: [],
              // Slot (Enable slot mode)
              isSlotMode: props.isSlotMode,
              // (Whether to select all)
              isCheckAll: false,
              // (Hide paging)
              isHidePaging: props.isHidePaging,
              // KEY (KEY field name)
              keyColumn: computed(() => {
                  let key = '';
                  Object.assign(props.columns).forEach((col) => {
                      if (col.isKey) {
                          key = col.field;
                      }
                  });
                  return key;
              }),
              // (current page number)
              page: props.page,
              // (Display count per page)
              pageSize: defaultPageSize.value,
              // (Maximum number of pages)
              maxPage: computed(() => {
                  if (props.total <= 0) {
                      return 0;
                  }
                  let maxPage = Math.floor(props.total / setting.pageSize);
                  let mod = props.total % setting.pageSize;
                  if (mod > 0) {
                      maxPage++;
                  }
                  return maxPage;
              }),
              // (The starting value of the page number)
              offset: computed(() => {
                  return (setting.page - 1) * setting.pageSize + 1;
              }),
              // (Maximum number of pages0
              limit: computed(() => {
                  let limit = setting.page * setting.pageSize;
                  return props.total >= limit ? limit : props.total;
              }),
              // (Paging array)
              paging: computed(() => {
                  let startPage = setting.page - 2 <= 0 ? 1 : setting.page - 2;
                  if (setting.maxPage - setting.page <= 2) {
                      startPage = setting.maxPage - 4;
                  }
                  startPage = startPage <= 0 ? 1 : startPage;
                  let pages = [];
                  for (let i = startPage; i <= setting.maxPage; i++) {
                      if (pages.length < 5) {
                          pages.push(i);
                      }
                  }
                  return pages;
              }),
              // (Sortable for local)
              order: props.sortable.order,
              sort: props.sortable.sort,
              pageOptions: props.pageOptions,
          });
  
          // (Checked rows)
          const isChecked = ref([]);
  
          // (Data rows for local)
          const localRows = computed(() => {
              let rows = props.rows;
              var collator = new Intl.Collator(undefined, {
                  numeric: true,
                  sensitivity: 'base',
              });
              let sortOrder = setting.sort === 'desc' ? -1 : 1;
              // Logic for sorting based on sorting count:
              // If sorted 1 or 2 times, apply custom sorting;
              // If sorted more than 2 times, reset table data to initial state.
              // Sorting is based on 'order' property.
              if (setting.sortCount.length) {
                  rows.sort(function (a, b) {
                      return collator.compare(a[setting.order], b[setting.order]) * sortOrder;
                  });
              } else {
                  rows.sort(function (a, b) {
                      return collator.compare(a['order'], b['order']) * 1;
                  });
              }
  
              let result = null;
              if (props.groupingKey) {
                  // If have set grouping-key create group temp data
                  let tmp = {};
                  rows.forEach((v) => {
                      if (!tmp[v[props.groupingKey]]) {
                          tmp[v[props.groupingKey]] = [];
                      }
                      tmp[v[props.groupingKey]].push(v);
                  });
  
                  result = {};
                  for (let index = setting.offset - 1; index < setting.limit; index++) {
                      result[rows[index][props.groupingKey]] = tmp[rows[index][props.groupingKey]];
                  }
              } else {
                  result = [];
                  for (let index = setting.offset - 1; index < setting.limit; index++) {
                      result.push(rows[index]);
                  }
              }
  
              nextTick(function () {
                  callIsFinished();
              });
  
              return result;
          });
  
          ////////////////////////////
          //
          //  Checkbox
          //  (Checkbox related operations)
          //
  
          // Checkbox (Define Checkbox reference)
          const rowCheckbox = ref([]);
  
          /**
       * (Execute before re-rendering)
       */
          onBeforeUpdate(() => {
              // (Clear all values before each update)
              rowCheckbox.value = [];
          });
  
          /**
       * Checkbox (Check all checkboxes for monitoring)
       */
          watch(
              () => setting.isCheckAll,
              (state) => {
                  if (props.hasCheckbox) {
                      isChecked.value = [];
                      if (state) {
                          let tmpRows = (props.isStaticMode) ? props.rows.slice((setting.offset - 1), setting.limit) : props.rows;
                          if (props.checkedReturnType == 'row') {
                              isChecked.value = tmpRows;
                          } else {
                              tmpRows.forEach((val) => {
                                  isChecked.value.push(val[setting.keyColumn]);
                              });
                          }
                      }
                      rowCheckbox.value.forEach((val) => {
                          if (val) {
                              val.checked = state;
                          }
                      });
                      // (Return the selected data on the screen)
                      emit('return-checked-rows', isChecked.value);
                  }
              }
          );
  
          /**
       * Checkbox (hasCeckbox props for monitoring)
       */
          watch(
              () => props.hasCheckbox,
              (v) => {
                  if (!v) {
                      setting.isCheckAll = false;
                  }
              }
          );
  
          /**
       * Checkbox (Checkbox click event)
       */
          const checked = (row, event) => {
              event.stopPropagation();
              let checkboxValue = row[setting.keyColumn];
              if (props.checkedReturnType == 'row') {
                  checkboxValue = row;
              }
              if (event.target.checked) {
                  isChecked.value.push(checkboxValue);
              } else {
                  const index = isChecked.value.indexOf(checkboxValue);
                  if (index >= 0) {
                      isChecked.value.splice(index, 1);
                  }
              }
              if (isChecked.value.length == props.rows.length) {
                  setting.isCheckAll = true;
              } else {
                  // (Return the selected data on the screen)
                  emit('return-checked-rows', isChecked.value);
              }
          };
  
          const resizableGrid = (table) => {
              let row = table.getElementsByTagName('tr')[0],
                  cols = row ? row.children : undefined;
              if (!cols) return;
  
  
              let tableHeight =
                  table.querySelector('.vtl-tbody')?.offsetHeight +
                  table.querySelector('.vtl-thead')?.offsetHeight +
                  (table.querySelector('.total-row')?.offsetHeight ?? 0);
  
              for (let i=0;i<cols.length;i++){
                  if (!cols[i].classList.contains('no-resizable')) {
                      let div = createDiv(tableHeight);
                      cols[i].appendChild(div);
                      setListeners(div);
                  }
              }
  
              function setListeners(div){
                  // eslint-disable-next-line no-unused-vars
                  let pageX,curCol,nxtCol,curColWidth,nxtColWidth,thElement;
  
                  div.addEventListener('mousedown', function (e) {
                      curCol = e.target.parentElement.querySelector('.vtl-thead-column');
                      thElement = e.target.parentElement;
                      nxtCol = curCol.nextElementSibling;
                      pageX = e.pageX;
  
                      let padding = paddingDiff(curCol);
  
                      curColWidth = curCol.offsetWidth - padding;
                      if (nxtCol)
                          nxtColWidth = nxtCol.offsetWidth - padding;
                  });
  
                  div.addEventListener('mouseover', function (e) {
                      e.target.style.borderRight = '3px solid #4296FD';
                  });
  
                  div.addEventListener('mouseout', function (e) {
                      e.target.style.borderRight = '';
                  });
  
                  document.addEventListener('mousemove', function (e) {
                      if (curCol) {
                          let diffX = e.pageX - pageX;
                          let minWidth = thElement.style.minWidth.split('%')[0];
  
                          if ((curColWidth + diffX) < 1000 && minWidth < (curColWidth + diffX)) {
                              curCol.style.minWidth = (curColWidth + diffX)+'px';
                          }
                      }
                  });
  
                  document.addEventListener('mouseup', function () {
                      curCol = undefined;
                      nxtCol = undefined;
                      pageX = undefined;
                      nxtColWidth = undefined;
                      curColWidth = undefined;
                  });
              }
  
              function createDiv(height){
                  let div = document.createElement('div');
                  div.style.top = 0;
                  div.style.right = 0;
                  div.style.width = '10px';
                  div.style.paddingLeft = '10px';
                  div.style.paddingRight = '10px';
                  div.style.position = 'absolute';
                  div.style.cursor = 'col-resize';
                  div.style.userSelect = 'none';
                  div.style.minHeight = height + 'px';
                  div.classList.add('resizer-cursor');
                  return div;
              }
  
              function paddingDiff(col){
  
                  if (getStyleVal(col,'box-sizing') == 'border-box'){
                      return 0;
                  }
  
                  let padLeft = getStyleVal(col,'padding-left');
                  let padRight = getStyleVal(col,'padding-right');
                  return (parseInt(padLeft) + parseInt(padRight));
  
              }
  
              function getStyleVal(elm,css){
                  return (window.getComputedStyle(elm, null).getPropertyValue(css));
              }
          };
          watch(localRows, (newValue, oldValue) => {
              let tableHeight = null;
              let resizerCursors = document.querySelectorAll('.resizer-cursor');
  
              // Update resizer divider's height if the row count changes
              if (newValue.length !== oldValue.length) {
                  setTimeout(() => {
                      tableHeight = document.querySelector('table .vtl-tbody').offsetHeight;
                      resizerCursors.forEach((resizer) => {
                          resizer.style.minHeight = tableHeight + 'px';
                      });
  
                  }, 100);
              }
          });
  
  
          /**
       * (Clear all selected data on the screen)
       */
          const clearChecked = () => {
              isChecked.value = [];
              rowCheckbox.value.forEach((val) => {
                  if (val && val.checked) {
                      val.checked = false;
                  }
              });
              // (Return the selected data on the screen)
              emit('return-checked-rows', isChecked.value);
          };
  
          ////////////////////////////
          //
          //  (Sorting, page change, etc. related operations)
          //
  
          const countSortClicks = (orderFieldName) => {
              setting.sortCount = setting.sortCount.filter(field => field === orderFieldName);
  
              let count = 0;
              for (let i = 0; i < setting.sortCount.length; i++) {
                  if (setting.sortCount[i] === orderFieldName) {
                      count++;
                  }
              }
              if (count >= 2) {
                  setting.sortCount = setting.sortCount.filter(field => field !== orderFieldName);
              } else {
                  setting.sortCount.push(orderFieldName);
              }
          };
  
          /**
       * (Call execution sequencing)
       */
          const doSort = (order) => {
              countSortClicks(order);
  
              let sort = 'asc';
              if (order == setting.order) {
                  // (When sorting items)
                  if (setting.sort == 'asc') {
                      sort = 'desc';
                  }
              }
              let offset = (setting.page - 1) * setting.pageSize;
              let limit = setting.pageSize;
              setting.order = order;
              setting.sort = sort;
              emit('do-search', offset, limit, order, sort);
  
              // (Clear the selected data on the screen)
              if (setting.isCheckAll) {
                  // (It will be cleared when you cancel all selections)
                  setting.isCheckAll = false;
              } else {
                  if (props.hasCheckbox) {
                      clearChecked();
                  }
              }
          };
  
          /**
       * (Switch page number)
       *
       * @param page      number   (New page number)
       * @param prevPage  number   (Current page number)
       */
          const changePage = (page, prevPage) => {
              setting.isCheckAll = false;
              if (props.hasCheckbox) {
                  isChecked.value = [];
              }
              let order = setting.order;
              let sort = setting.sort;
              let offset = (page - 1) * setting.pageSize;
              let limit = setting.pageSize;
              if (!props.isReSearch || page > 1 || page == prevPage) {
                  // (Call query will only be executed if the page number is changed without re-query)
                  emit('do-search', offset, limit, order, sort);
              }
          };
          // (Monitor page switching)
          watch(() => setting.page, (val, oldValue) => {
              if(val > setting.maxPage) {
                  setting.page = setting.maxPage;
              }
  
              if(!val || val === '-') {
                  setting.page = oldValue;
              }
              changePage;
          });
          // (Monitor manual page switching)
          watch(
              () => props.page,
              (val) => {
                  if (val <= 1) {
                      setting.page = 1;
                      emit('get-now-page', setting.page);
                  } else if (val >= setting.maxPage) {
                      setting.page = setting.maxPage;
                      emit('get-now-page', setting.page);
                  } else {
                      setting.page = val;
                  }
              }
          );
  
          /**
       * (Switch display number)
       */
          const changePageSize = () => {
              if (setting.page === 1) {
                  // changePage()
                  changePage(setting.page, setting.page);
              } else {
                  // changePage()
                  setting.page = 1;
                  setting.isCheckAll = false;
              }
          };
          // (Monitor display number switch from component)
          watch(() => setting.pageSize, changePageSize);
          // Prop (Monitor display number switch from prop)
          watch(
              () => props.pageSize,
              (newPageSize) => {
                  setting.pageSize = newPageSize;
              }
          );
  
          /**
       * (Previous page)
       */
          const prevPage = () => {
              if (setting.page == 1) {
                  // (If it is the first page, it will not be executed)
                  return false;
              }
              setting.page--;
          };
  
          /**
       * (Move to the specified number of pages)
       */
          const movePage = (page) => {
              setting.page = page;
          };
  
          /**
       * (Next page)
       */
          const nextPage = () => {
              if (setting.page >= setting.maxPage) {
                  // (If it is equal to or greater than the maximum number of pages, no execution)
                  return false;
              }
              setting.page++;
          };
  
          // (Monitoring data changes)
          watch(
              () => props.rows,
              () => {
                  if (props.isReSearch || props.isStaticMode) {
                      setting.page = 1;
                  }
                  nextTick(function () {
                      // (Return the private components after the data is rendered)
                      if (!props.isStaticMode) {
                          callIsFinished();
                      }
                  });
              }
          );
  
          const stringFormat = (template, ...args) => {
              return template.replace(/{(\d+)}/g, function (match, number) {
                  return typeof args[number] != 'undefined' ? args[number] : match;
              });
          };
  
          // Call is-finished Method
          const callIsFinished = () => {
              if (localTable.value) {
                  let localElement = localTable.value.getElementsByClassName('is-rows-el');
                  emit('is-finished', localElement);
              }
              emit('get-now-page', setting.page);
          };
  
          // Toggle button elements
          const toggleButtonRefs = ref({});
          // Grouping rows
          const groupingRowsRefs = ref({});
          // Saved toggle status
          const groupingToggleStatus = ref({});
  
          // Data rows for grouping (Default-mode only)
          const groupingRows = computed(() => {
              let result = {};
              props.rows.forEach((v) => {
                  if (!result[v[props.groupingKey]]) {
                      result[v[props.groupingKey]] = [];
                  }
                  result[v[props.groupingKey]].push(v);
              });
  
              nextTick(function () {
                  if (props.startCollapsed || props.isKeepCollapsed) {
                      for (const [groupIndex, el] of Object.entries(toggleButtonRefs.value)) {
                          if (el) {
                              let isOpen = !props.startCollapsed;
                              if (
                                  props.isKeepCollapsed &&
                  groupingToggleStatus.value[groupIndex] !== undefined
                              ) {
                                  isOpen = !groupingToggleStatus.value[groupIndex];
                              }
                              if (
                                  (isOpen && el.parentElement.classList.contains('rotated-90')) ||
                  (!isOpen && !el.parentElement.classList.contains('rotated-90'))
                              ) {
                                  el.parentElement.classList.toggle('rotated-90');
                              }
                              if (!isOpen) {
                                  groupingRowsRefs.value[groupIndex].forEach((element) => {
                                      if (element) {
                                          element.classList.add('hidden');
                                      }
                                  });
                              }
                          }
                      }
                  }
                  callIsFinished();
              });
  
              return result;
          });
  
          /**
       * Toggle Group rows
       *
       * @param {String} groupIndex
       */
          const toggleGroup = (groupIndex) => {
              let targetEl = toggleButtonRefs.value[groupIndex];
              if (targetEl) {
                  targetEl.parentElement.classList.toggle('rotated-90');
                  const isClose = targetEl.parentElement.classList.contains('rotated-90');
                  groupingRowsRefs.value[groupIndex].forEach((element) => {
                      if (element) {
                          if (isClose) {
                              element.classList.add('hidden');
                          } else {
                              element.classList.remove('hidden');
                          }
                      }
                  });
                  groupingToggleStatus.value[groupIndex] = isClose;
                  emit('row-toggled', groupingRows.value[groupIndex], isClose);
              }
          };
  
          /**
       * Add hover class to tr
       *
       * @param {MouseEvent} mouseEvent
       */
          const addHoverClassToTr = (mouseEvent) => {
              mouseEvent.target.classList.add('hover');
          };
  
          /**
       * Remove hover class from tr
       *
       * @param {MouseEvent} mouseEvent
       */
          const removeHoverClassFromTr = (mouseEvent) => {
              mouseEvent.target.classList.remove('hover');
          };
  
          /**
       * (Mounted Event)
       */
          onMounted(() => {
              if (props.resizable) {
                  let tables = document.getElementsByTagName('table');
                  for (let i=0; i<tables.length;i++){
                      resizableGrid(tables[i]);
                  }
              }
  
              nextTick(() => {
                  if (props.rows.length > 0) {
                      callIsFinished();
                  }
              });
          });
  
          return {
              slots,
              localTable,
              localRows,
              setting,
              rowCheckbox,
              checked,
              clearChecked,
              doSort,
              prevPage,
              movePage,
              nextPage,
              stringFormat,
              limiter,
              toggleButtonRefs,
              groupingRowsRefs,
              groupingRows,
              toggleGroup,
              addHoverClassToTr,
              removeHoverClassFromTr,
          };
      },
  });
  </script>
  
  <style scoped lang="scss">
  @import '@/assets/scss/new/components/tableLiteComponent';
  </style>
  