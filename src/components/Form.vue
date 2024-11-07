<template>
  <div :style="{backgroundColor: themeChartBgColor}">
  <Layout
    :class="{'layout-sider': true, 'semi-always-dark': themeString == 'DARK', 'semi-always-light': themeString == 'LIGHT'}"
    class="layout-container"
    :style="{backgroundColor: themeChartBgColor}"
    style="overflow: hidden; width: 100vw; height: 100vh; display: flex;background-color: transparent;"
  >
    <div
      v-if="state === STATE_ARRAY[1] || state === STATE_ARRAY[0]"
      style="
        width: 100%;
        height: 1px;
        background-color: var(--semi-color-stroke);
        position: absolute;
      "
      :style="{backgroundColor: themeChartBgColor}"
    ></div>
    <LayoutContent
      class="layout-content"
      :style="{
        backgroundColor: themeChartBgColor,
        width:
          state == STATE_ARRAY[2] || state == STATE_ARRAY[3]
            ? '100% !important'
            : '100% !important',
        height:
          state == STATE_ARRAY[2] || state == STATE_ARRAY[3]
            ? '100% !important'
            : '100vh !important',
      }"
    >
      <div class="carousel-container">
        <Carousel
          animation="fade"
          :speed="targetCarouselSpeed * 1000"
          :autoPlay="true"
          :theme="isDark ? 'light' : 'dark'"
          style="width: 100%; height: 100%"
          indicatorType="line"
          :showArrow="false"
          @change="onCarouselChange"
        >
          <div
            class="page-container"
            v-for="(page, pageIndex) in logoShownList"
            :key="pageIndex"
          >
            <div
              class="logo-list-container"
              :style="{
                'grid-template-columns': `repeat(${targetStyleColumnNumber}, 1fr)`,
                'grid-template-rows': `repeat(${targetStyleRowNumber}, minmax(0, 1fr))`,
                'row-gap': targetStyleRowGap + 'px',
                'column-gap': targetStyleColumnGap + 'px',
              }"
            >
              <div
                class="logo-container"
                :style="{
                  width: 100 + '%',
                  borderRadius: targetStyleRadius + 'px',
                  border:
                    targetStyleBorderWidth +
                    'px' +
                    ' ' +
                    targetBorderOption +
                    ' ' +
                    `${targetStyleBorderColor}${targetStyleBorderOpacity}`,
                  backgroundColor: hexToRgba(targetStyleBgColor, targetStyleOpacity),
                  boxSizing: 'border-box',
                }"
                v-for="(url, urlIndex) in page"
                :key="urlIndex"
              >
                <img
                  v-show="!isLoading"
                  :src="url"
                  :style="{
                    objectFit: targetModeOption,
                    width: logoPercent + '%',
                    height: logoPercent + '%',
                  }"
                  @load="onImageLoad"
                  class="logoImage"
                />
                <div v-show="isLoading"><Spin size="middle" /></div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </LayoutContent>

    <!-- 配置区域 -->
    <LayoutSider
      v-if="state === STATE_ARRAY[1] || state === STATE_ARRAY[0]"
      :class="{'layout-sider': true, 'semi-always-dark': themeString == 'DARK', 'semi-always-light': themeString == 'LIGHT'}"
      style="
        height: 100%;
        border-left: 1px solid var(--semi-color-stroke);
        flex: 0 0 340px;
      "
    >
      <!-- TABLE SELECT  -->
      <div
        class="formPanel"
        style="width: 100%; height: 100%; display: flex; flex-direction: column"
      >
        <div
          class="form"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: auto;
          "
        >
          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.table") }}</div>
            <Select
              :optionList="tableOptionList"
              :defaultValue="targetTableId"
              :value="targetTableId"
              @change="onTableIdChange"
              style="
                margin-top: 8px;
                width: 100%;
                background-color: transparent;
                border: 1px solid var(--semi-color-stroke);
                border-radius: 6px;
              "
            />
          </a-form-item>
          <!-- LABEL SELECT  -->
          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.view") }}</div>
            <Select
              :optionList="viewOptionList"
              :value="targetViewId"
              @change="onViewIdChange"
              style="
                margin-top: 8px;
                width: 100%;
                background-color: transparent;
                border: 1px solid var(--semi-color-stroke);
                border-radius: 6px;
              "
            />
          </a-form-item>

          <!-- FIELD SELECT  -->
          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.field") }}</div>
            <Select
              :optionList="fieldOptionList"
              :value="targetFieldId"
              placeholder="请选择一个字段"
              @change="onFieldIdChange"
              style="
                margin-top: 8px;
                width: 100%;
                background-color: transparent;
                border: 1px solid var(--semi-color-stroke);
                border-radius: 6px;
              "
            />
          </a-form-item>

          <!-- CONST MODEL SELECT  -->
          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.mode") }}</div>
            <Select
              :optionList="modeOptionList"
              defaultValue="contain"
              :value="targetModeOption"
              @change="onModeOptionChange"
              style="
                margin-top: 8px;
                width: 100%;
                background-color: transparent;
                border: 1px solid var(--semi-color-stroke);
                border-radius: 6px;
              "
            />
          </a-form-item>

          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.number") }}</div>
            <InputNumber
              style="
                margin-top: 8px;
                width: 100%;
                border: 1px solid var(--semi-color-stroke);
                border-radius: 6px;
              "
              :value="targetNumberShown"
              :min="1"
              @change="onOriginalNumberShownChange"
            />
          </a-form-item>

          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.style.name") }}</div>
            <div class="style-container">
              <div>
                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.row_num") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :value="targetStyleRowNumber"
                    @change="onOriginalStyleRowNumber"
                  />
                </b-form-item>

                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.column_num") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :value="targetStyleColumnNumber"
                    @change="onOriginalStyleColumnNumber"
                  />
                </b-form-item>
              </div>
              <div>
                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.row_gap") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :value="targetStyleRowGap"
                    @change="onOriginalStyleRowGap"
                  />
                </b-form-item>

                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.column_gap") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :value="targetStyleColumnGap"
                    @change="onOriginalStyleColumnGap"
                  />
                </b-form-item>
              </div>
              <div>
                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.logo_size") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :min="0"
                    :value="logoPercent"
                    @change="onLogoPercent"
                  />
                </b-form-item>

                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.radius") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :min="0"
                    :value="targetStyleRadius"
                    @change="onOriginalStyleRadious"
                  />
                </b-form-item>
              </div>
              <div>
                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.background_color") }}</div>
                  <Input
                    class-name="backGroundColorInput"
                    size="default"
                    type="color"
                    style="
                      margin-top: 8px;
                      height: 34px;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :suffix="targetStyleBgColor"
                    :value="targetStyleBgColor"
                    @change="onOriginalStyleBgColor"
                  />
                </b-form-item>

                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.background_opacity") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :value="targetStyleOpacity"
                    :min="0"
                    :max="100"
                    @change="onOriginalStyleOpacity"
                  />
                </b-form-item>
              </div>
              <div>
                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.border_color") }}</div>
                  <Input
                    class-name="borderColorInput"
                    size="default"
                    type="color"
                    style="
                      margin-top: 8px;
                      height: 34px;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :suffix="targetStyleBorderColor"
                    :value="targetStyleBorderColor"
                    @change="onOriginalStyleBorderColor"
                  />
                </b-form-item>

                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.border_opacity") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :min="0"
                    :max="100"
                    :value="targetStyleBorderOpacity"
                    @change="onOriginalStyleBorderOpacity"
                    
                  />
                </b-form-item>
              </div>

              <div>
                <b-form-item class="b-form-item">
                  <div>{{ $t("label.mode") }}</div>
                  <Select
                    :optionList="borderOptionList"
                    defaultValue="solid"
                    :value="targetBorderOption"
                    @change="onBorderOptionChange"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      height: 34px;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    
                  />
                </b-form-item>

                <b-form-item class="b-form-item">
                  <div>{{ $t("label.style.border_width") }}</div>
                  <InputNumber
                    size="default"
                    style="
                      margin-top: 8px;
                      width: 100%;
                      border: 1px solid var(--semi-color-stroke);
                      border-radius: 6px;
                    "
                    :min="0"
                    :value="targetStyleBorderWidth"
                    @change="onOriginalStyleBorderWidth"
                  />
                </b-form-item>
              </div>
            </div>
          </a-form-item>

          <a-form-item class="a-form-item">
            <div class="lable">{{ $t("label.speed") }}</div>
            <InputNumber
              style="
                margin-top: 8px;
                width: 100%;
                border-radius: 6px;
                border: 1px solid var(--semi-color-stroke);
              "
              :min="0"
              :value="targetCarouselSpeed"
              @change="onTargetCarouselSpeed"
            />
          </a-form-item>
        </div>
        <a-form-item
          class="a-form-item"
          style="height: 70px; display: flex; flex-direction: row-reverse"
        >
          <Button
            @click="saveConfig"
            theme="solid"
            type="primary"
            style="width: 80px; border-radius: 4px"
            >确定</Button
          >
        </a-form-item>
      </div>
    </LayoutSider>
  </Layout>
</div>
</template>

<script lang="ts" setup>
import {
  dashboard,
  DashboardState,
  bitable,
  FieldType,
  IFieldMeta
} from "@lark-base-open/js-sdk";
import { useI18n } from "vue-i18n";
import { ref, onMounted, computed, watch, shallowRef } from "vue";
import {
  Layout,
  LayoutSider,
  LayoutContent,
  Spin,
  Button,
  Select,
  Carousel,
  Icon,
  InputNumber,
  Input,
  Image,
  Slider,
} from "@kousum/semi-ui-vue";
import * as myBase from "../utils/base";
import * as CONSTANT from "../utils/constant";
import * as commonFn from "../utils/common";

defineProps<{
  isDark: boolean;
}>();

// -- 配置区域
const { t } = useI18n(); // 国际化
const STATE_ARRAY = ["Create", "Config", "View", "FullScreen"];
type OptionItem = { label: string; value: string };
const themeChartBgColor = ref("")
// -- 核心数据
const state = ref("Create"); // 初始状态为配置模式
const logoShownList = ref<string[]>([]);
const targetTableId = ref("");
const targetViewId = ref("");
const targetFieldId = ref("");
const targetModeOption = ref("contain");
const targetNumberShown = ref(20);
const targetStyleRowNumber = ref(2);
const targetStyleColumnNumber = ref(3);
const targetStyleRowGap = ref(10);
const targetStyleColumnGap = ref(10);
const targetStyleRadius = ref(10);
const targetStyleBorderWidth = ref(1);
const targetStyleBgColor = ref("#888888");
const targetStyleBorderColor = ref("#888888");
const targetStyleOpacity = ref(10);
const targetCarouselSpeed = ref(1);
const logoPercent = ref(60);
const targetBorderOption = ref("solid");
const targetStyleBorderOpacity = ref(10);
const fieldMetaList = shallowRef<IFieldMeta[]>([]);
const fieldType = computed(() => {
  if (fieldMetaList.value.length === 0 || !targetFieldId.value)
    return FieldType.Attachment;
  return (
    fieldMetaList.value.find((item) => item.id === targetFieldId.value)?.type ??
    FieldType.Attachment
  );
});
// -- 辅助数据
const themeString = ref<String>("");  // 仪表盘主题: DARK or LIGHT
const tableOptionList = ref<OptionItem[]>([]);
const viewOptionList = ref<OptionItem[]>([]);
const fieldOptionList = ref<OptionItem[]>([]);
const modeOptionList = ref([
  { label: "适应", value: "contain" },
  { label: "裁切铺满", value: "cover" },
  { label: "拉伸填充", value: "fill" },
]);
const borderOptionList = ref([
  { label: "实线", value: "solid" },
  { label: "双线", value: "double" },
  { label: "虚线", value: "dashed" },
  { label: "点线", value: "dotted" },
]);
const isLoading = ref(true)
const carouselActiveIndex = ref(0); // 轮播图当前索引
let intervalId = 0;

let originAttachmentList: string[] = []; // 原始附件列表

// -- 方法 --
/**
 * 保存配置
 */
const saveConfig = async () => {
  const config = {
    customConfig: {
      tableId: targetTableId.value,
      viewId: targetViewId.value,
      fieldId: targetFieldId.value,
      modeOption: targetModeOption.value,
      numberShown: targetNumberShown.value,
      targetStyleRowNumber: targetStyleRowNumber.value,
      targetStyleColumnNumber: targetStyleColumnNumber.value,
      styleRowGap: targetStyleRowGap.value,
      styleColumnGap: targetStyleColumnGap.value,
      targetStyleRadious: targetStyleRadius.value,
      logoShownList: JSON.stringify(logoShownList.value),
      targetCarouselSpeed: targetCarouselSpeed.value,
      targetStyleBgColor: targetStyleBgColor.value,
      targetStyleOpacity: targetStyleOpacity.value,
      targetStyleBorderColor: targetStyleBorderColor.value,
      targetStyleBorderWidth: targetStyleBorderWidth.value,
      logoPercent: logoPercent.value,
      targetBorderOption: targetBorderOption.value,
      targetStyleBorderOpacity: targetStyleBorderOpacity.value,
    },
  }
  await dashboard.saveConfig(config);

  await initDashboard(config);
};

const simulateCarouselChange = () => {
  carouselActiveIndex.value =
    (carouselActiveIndex.value + 1) % logoShownList.value.length;
};

const onImageLoad = () => {
  isLoading.value = false;
}

const hexToRgba = (hex:string, opacity:any) => {
  // 移除十六进制颜色值前的'#'
  hex = hex.replace("#", "");

  // 解析十六进制值
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // 返回rgb格式的字符串
  console.log()
  return "rgba(" + r + "," + g + "," + b + "," + opacity/100 + ")";
}


const formatOptionList = async (
  oldOptionList: {
    name: string;
    id: string;
  }[]
) => {
  return oldOptionList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const queryAttachmentList = async (
  tableId: string,
  viewId: string,
  fieldId: string,
  length: number,
  fieldType: FieldType
) => {
  const recordIdList = (await myBase.queryVisibleRecordList(tableId, viewId)).filter(
    Boolean
  ) as string[];
  if (recordIdList.length === 0) return;

  return await myBase.queryAttachmentList(
    tableId,
    recordIdList,
    fieldId,
    length,
    fieldType
  );
};

// --== 监听事件：包括 watch 方法和 @change 方法

// 1. 依据tableId变化，更新viewOptionList
watch(targetTableId, async (newTableId) => {
  if (newTableId !== "") viewOptionList.value = await queryViewOptionList(newTableId);
  fieldOptionList.value = await queryFieldOptionList(newTableId, targetViewId.value);
  carouselActiveIndex.value = 0
});

// 2. 依据viewId变化，更新fieldOptionList
watch(targetViewId, async (newViewId) => {
  if (newViewId !== "") {
    fieldOptionList.value = await queryFieldOptionList(targetTableId.value, newViewId);
    carouselActiveIndex.value = 0
  }
  
});

// 3. 依据fieldId和viewId变化，获取attachmentList
watch([targetViewId, targetFieldId], async ([newViewId, newFieldId], []) => {
  if (newFieldId !== "" && newViewId !== "") {
    originAttachmentList =
      (await queryAttachmentList(
        targetTableId.value,
        targetViewId.value,
        newFieldId,
        targetNumberShown.value,
        fieldType.value
      )) ?? [];
    // 数组拆分
    splitLogoShownList(originAttachmentList);
    carouselActiveIndex.value = 0
  }
});

dashboard.onThemeChange(res => {
  themeChartBgColor.value = res.data.chartBgColor

  if (res.data.chartBgColor == "var(--bg-body)")
    themeChartBgColor.value = "#ffffff"
  console.log(res.data.chartBgColor)
  console.log(res.data.theme)
  themeString.value = res.data.theme
  console.log(themeString.value)
  
});  


const onTableIdChange = async (e: string) => {
  targetTableId.value = e;
  targetViewId.value = "allData";
  targetFieldId.value = await queryFieldIdDefaultValue(e);
};

const onViewIdChange = (e: string) => {
  targetViewId.value = e;
  console.log("targetViewId.value", targetViewId.value);
};

const onFieldIdChange = (e: string) => {
  targetFieldId.value = e;
};

const onOriginalNumberShownChange = async (e: number) => {
  if (targetNumberShown.value < e) {
    targetNumberShown.value = e;
    originAttachmentList =
      (await queryAttachmentList(
        targetTableId.value,
        targetViewId.value,
        targetFieldId.value,
        targetNumberShown.value,
        fieldType.value
      )) ?? [];
  } else {
    targetNumberShown.value = e;
    originAttachmentList = originAttachmentList.slice(0, targetNumberShown.value);
  }

  splitLogoShownList(originAttachmentList);
};

const onModeOptionChange = (e: string) => {
  targetModeOption.value = e;
};

const onCarouselChange = (newIndex) => {
  carouselActiveIndex.value = newIndex;
};

const onOriginalStyleRowNumber = (e) => {
  targetStyleRowNumber.value = e;
  splitLogoShownList(originAttachmentList);
};

const onOriginalStyleColumnNumber = (e) => {
  targetStyleColumnNumber.value = e;
  splitLogoShownList(originAttachmentList);
};

const onOriginalStyleRowGap = (e) => {
  targetStyleRowGap.value = e;
};

const onOriginalStyleColumnGap = (e) => {
  targetStyleColumnGap.value = e;
};

const onLogoPercent = (e) => {
  logoPercent.value = e;
};

const onBorderOptionChange = (e) => {
  targetBorderOption.value = e;
};

const onOriginalStyleBorderOpacity = (e) => {
  targetStyleBorderOpacity.value = e;
};

const onOriginalStyleRadious = (e) => {
  targetStyleRadius.value = e;
};

const onOriginalStyleBorderWidth = (e) => {
  targetStyleBorderWidth.value = e;
};

const onOriginalStyleBgColor = (e) => {
  targetStyleBgColor.value = e;
};

const onOriginalStyleBorderColor = (e) => {
  targetStyleBorderColor.value = e;
};

const onTargetCarouselSpeed = (e) => {
  targetCarouselSpeed.value = e;
  clearInterval(intervalId);
  intervalId = 0;
  intervalId = setInterval(simulateCarouselChange, targetCarouselSpeed.value * 1000);
};

const onOriginalStyleOpacity = (e) => {
  targetStyleOpacity.value = e;
};

const queryViewOptionList = async (tableId) => {
  const list = await myBase.queryViewMetaList(tableId);
  list.unshift({ name: t("allData"), id: "allData" });
  return await formatOptionList(list);
};

const queryFieldOptionList = async (tableId, viewId) => {
  const list = await myBase.queryFieldMetaList(tableId, viewId);
  const listFiltered = list.filter((item) =>
    CONSTANT.SUPPORT_FIELD_TYPE.includes(item.type)
  );
  fieldMetaList.value = listFiltered;
  return await formatOptionList(listFiltered);
};

const initTableOptionList = async () => {
  const list = await myBase.queryBaseTableMetaList();
  tableOptionList.value = await formatOptionList(list);
};

const queryTableIdDefaultValue = async () => {
  for (let option of tableOptionList.value) {
    const fields = await myBase.queryFieldMetaList(option.value, "allData");
    // 判断该表格是否有 Attachment 或 Url 字段
    if (
      fields.some(
        (field) => field.type === FieldType.Attachment || field.type === FieldType.Url
      )
    ) {
      return option.value;
    }
  }
  // 如果没有找到含有 Attachment 或 Url 字段的表格，则返回第一张表格的id
  return tableOptionList.value[0]?.value;
};

const queryViewIdDefaultValue = () => {
  return "allData";
};

const queryFieldIdDefaultValue = async (targetTableId: string) => {
  const fields = await myBase.queryFieldMetaList(targetTableId, "allData");
  let fieldId = "";

  // 查找 Attachment 类型字段
  fieldId = fields.find((field) => field.type === FieldType.Attachment)?.id;
  if (fieldId) return fieldId;

  // 查找 Url 类型字段
  fieldId = fields.find((field) => field.type === FieldType.Url)?.id;
  if (fieldId) return fieldId;

  // 查找 Text 类型字段
  fieldId = fields.find((field) => field.type === FieldType.Text)?.id;
  if (fieldId) return fieldId;

  // 选择第一个字段
  return fields[0]?.id;
};

const queryOriginalAttachmentListDefaultValue = () => {
  const list = [];
  const defaultLogoSrc = CONSTANT.DEFAULT_IMAGE_PATH;
  for (let i = 0; i < targetNumberShown.value; i++) {
    list.push(defaultLogoSrc);
  }
  return list;
};

const splitLogoShownList = (attachmentList) => {
  logoShownList.value = commonFn.splitListInto2DArray(
    attachmentList,
    targetStyleRowNumber.value * targetStyleColumnNumber.value
  );
  console.log("logoShownList", logoShownList.value);
};

const initWithoutConfig = async () => {
  await initTableOptionList();

  targetTableId.value = await queryTableIdDefaultValue();
  targetViewId.value = queryViewIdDefaultValue();
  targetFieldId.value = await queryFieldIdDefaultValue(targetTableId.value);
  originAttachmentList = queryOriginalAttachmentListDefaultValue();
  splitLogoShownList(originAttachmentList);
};

const initDashboard = async (config) => {
  const customConfig = config.customConfig;
  
  await initTableOptionList();

  targetTableId.value =
    "tableId" in customConfig ? customConfig.tableId : await queryTableIdDefaultValue();
  targetViewId.value = customConfig.viewId;
  targetFieldId.value = customConfig.fieldId;
  targetModeOption.value = customConfig.modeOption;
  targetNumberShown.value = customConfig.numberShown;
  targetStyleColumnNumber.value = customConfig.targetStyleColumnNumber;
  targetStyleRowNumber.value = customConfig.targetStyleRowNumber;
  targetStyleRowGap.value = customConfig.styleRowGap;
  targetStyleColumnGap.value = customConfig.styleColumnGap;
  targetStyleRadius.value = customConfig.targetStyleRadious;
  targetCarouselSpeed.value = customConfig.targetCarouselSpeed;
  targetStyleBgColor.value = customConfig.targetStyleBgColor;
  targetStyleBorderColor.value = customConfig.targetStyleBorderColor;
  targetStyleBorderWidth.value = customConfig.targetStyleBorderWidth;
  targetStyleOpacity.value = customConfig.targetStyleOpacity;
  logoPercent.value = customConfig.logoPercent;
  targetBorderOption.value = customConfig.targetBorderOption;
  targetStyleBorderOpacity.value = customConfig.targetStyleBorderOpacity;
  logoShownList.value = JSON.parse(customConfig.logoShownList);
  originAttachmentList = JSON.parse(customConfig.originAttachmentList);
  targetCarouselSpeed.value =
    "carouselSpeed" in customConfig ? customConfig.carouselSpeed : 1;

  // 模拟定时切换
  intervalId = setInterval(simulateCarouselChange, targetCarouselSpeed.value * 1000);

};


onMounted(async () => {
  // 初始化勾选字段
  state.value = dashboard.state;
  console.log("state", state.value);
  
  const theme = await dashboard.getTheme();
  console.log("theme", theme)
  themeString.value = theme.theme
  // unsubscribe = dashboard.onThemeChange(handleThemeChange);

  if (state.value == STATE_ARRAY[0]) {
    await initWithoutConfig();
  } else {
    const config = await dashboard.getConfig();
    console.log("config", config);
    if ("customConfig" in config) {
      await initDashboard(config);
    } else {
      await initWithoutConfig();
    } 
  }



});

</script>

<style scoped>
.main-config,
.main-display {
  transition: all 0.3s; /* 添加平滑过渡效果 */
}

.layout-content {
  align-items: center;
  justify-content: center;
}

.carousel-container {
  width: 100%;
  height: 100%;
}

.a-form-item {
  margin: 16px 0;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

:deep(.semi-input) {
  background-color: transparent;
  line-height: 32px;
}

:deep(.semi-input-wrapper-default) {
  background-color: transparent;
}

:deep(.semi-input-wrapper-focus) {
  background-color: transparent;
  border-color: transparent;
}

:deep(.semi-carousel-indicator-line) {
  bottom: 10px !important;
  width: 40px;
}

:deep(.semi-input-number-suffix-btns) {
  border-left: 1px solid var(--semi-color-stroke);
  border-bottom: none;
  border-top: none;
  border-right: none;
  border-radius: 0 6px 6px 0;
  margin-left: 0;
  background-color: transparent;
}

:deep(.semi-input-wrapper) {
  border-radius: 0;
  line-height: 24px;
  border: none;
}

:deep(.semi-carousel-indicator-line .semi-carousel-indicator-item) {
  border-radius: 40px;
  height: 5px;
}

.lable {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  color: var(--semi-color-text-0);
}

.label-dark {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  color: rgba(255, 255, 255, 1);
  /* 208, 211, 214 */
}

.style-container > div > b-form-item-dark {
  width: 48%;
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.8);
}

.style-container {
  margin-top: 8px;
  width: calc(100% - 16px);
  padding: 16px 8px;
  gap: 20px;
  border-radius: 6px;
  background-color: rgba(135, 135, 135, 0.08);
  display: flex;
  flex-direction: column;
}

.style-container > div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.style-container > div > b-form-item {
  width: 48%;
  font-size: 12px !important;
  color: var(--semi-color-text-1);
}

.page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.logo-list-container {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  padding-bottom: 20px;
  display: grid;
  flex-wrap: wrap;
  flex-direction: row;
}

.logo-container {
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.semi-image) {
  display: flex;
  align-self: center;
  justify-content: center;
}

.backGroundColorInput:deep(.semi-input) {
  width: 46px;
  padding: 2px 12px 2px 12px;
  border: none;
  background-color: transparent;
  border-radius: 0;
  border-color: transparent;
}

.borderColorInput:deep(.semi-input) {
  width: 46px;
  padding: 2px 12px 2px 12px;
  border: none;
  background-color: transparent;
  border-radius: 0;
  border-color: transparent;
}

.semi-image {
  width: 100%;
  height: 100%;
}
</style>
