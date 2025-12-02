import { bitable as bitableSDK, FieldType, IOpenSegmentType } from '@lark-base-open/js-sdk';
import type { ITable, IOpenAttachment, IAttachmentField, IOpenUrlSegment, IUrlField, IOpenSegment, ITextField } from '@lark-base-open/js-sdk';
import * as CONSTANT from './constant'
/**
 * @query {获取 SDK table、view、existedFieldMetaList 等信息}
 * @return {object} table, view, existedFieldMetaList
 */
export const queryBaseTableAndView = async (tableId: string, bitable = bitableSDK) => {
    const table = await bitable.base.getTableById(tableId)
    const existedFieldMetaList = await table.getFieldMetaList();
    return { table, existedFieldMetaList }
}
/**
 * 异步获取基础表格元数据列表。
 * 
 * 该函数通过调用 bitable.base.getTableMetaList 方法，异步获取当前项目中所有基础表格的元数据列表。
 * 元数据列表包含各个表格的结构信息，如字段名、字段类型等，可用于表格数据的操作和管理。
 * 
 * @returns {Promise<Array>} 返回一个 Promise，解析为包含表格元数据的数组。
 */
export const queryBaseTableMetaList = async (bitable = bitableSDK) => {
    // 异步获取表格元数据列表
    const tableMetaList = await bitable.base.getTableMetaList()
    // 返回获取到的表格元数据列表
    return tableMetaList
}
/**
 * 根据表ID和字段类型异步查询表和字段元数据列表。
 * 
 * 本函数通过提供的表ID，查询并返回指定表的详细信息以及特定类型字段的元数据列表。
 * 这对于需要了解表结构和字段属性的场景非常有用，比如在前端展示表字段信息或进行数据验证时。
 * 
 * @param {string} tableId - 表的唯一标识ID。
 * @param {string} fieldType - 字段的类型，用于查询特定类型的字段元数据。
 * @returns {Object} 返回一个对象，包含表信息和字段元数据列表。
 */
export const queryTableAndFieldMetaTypeList = async (tableId: string, fieldType: string, bitable = bitableSDK) => {
    // 根据表ID获取表对象
    const table = await bitable.base.getTableById(tableId)
    // 根据字段类型获取该类型的所有字段元数据列表
    const fieldMetaListByType = await table.getFieldMetaListByType(FieldType[fieldType])
    console.log(fieldMetaListByType)
    // 返回包含表信息和字段元数据的对象
    return { table, fieldMetaListByType }
}
/**
 * 异步查询指定表的记录列表。
 * 
 * 本函数通过异步方式获取指定数据表中的所有记录列表。使用了async/await语法糖，以确保在获取记录列表的过程中不会阻塞其他代码的执行。
 * 这种方式适用于处理需要等待I/O操作（如数据库查询）完成的情况，能够提高应用的响应性和性能。
 * 
 * @param {Object} table - 数据表对象。这个对象应该提供了getRecordList方法，用于获取表中的记录列表。
 * @returns {Array} 返回一个包含记录的数组。每个记录都是表中的一行数据。
 */
export const queryRecordIdList = async (tableId: string, bitable = bitableSDK) => {
    // 根据表ID获取表对象
    const table = await bitable.base.getTableById(tableId)
    // 等待数据表的记录列表被获取。
    const recordIdList = await table.getRecordIdList();  // getVisibleRecordIdList 
    // 返回获取到的记录列表。
    return recordIdList;
}
/**
 * 根据表ID和字段ID异步查询字段信息。
 * 
 * 本函数使用Bitable API来获取特定表中指定字段的详细信息。它首先通过表ID检索表对象，然后从该表对象中获取指定字段ID的字段信息。
 * 这对于需要根据字段ID获取字段属性的应用场景非常有用，例如在表单生成或数据查询中。
 * 
 * @param {object} table - 表实例。
 * @param {string} fieldId - 字段的唯一标识ID。
 * @returns {Promise} 返回一个Promise对象，解析为字段对象，包含字段的详细信息。
 */
export const queryFieldById = async (table: ITable, fieldId: string) => {
    // 通过字段ID获取字段对象
    const field = await table.getFieldById(fieldId);
    return field
}
/**
 * 异步获取数据表的视图元数据列表。
 * 
 * 本函数通过异步方式，从指定的数据表中获取视图的元数据列表。这有助于开发者了解数据表中现有的视图，
 * 以便进一步进行数据查询或视图操作。使用前需要确保已经初始化了数据表对象。
 * 
 * @param {String} tableId - 数据表对象。该对象应提供getViewMetaList方法用于获取视图元数据列表。
 * @returns {Promise<Array>} 返回一个Promise，解析为视图元数据的数组。每个元数据对象包含关于视图的信息。
 */
export const queryViewMetaList = async (tableId: string, bitable = bitableSDK) => {
    const table = await bitable.base.getTableById(tableId)
    // 等待数据表的视图列表被获取。
    const viewMetaList = await table.getViewMetaList();
    // 返回获取到的视图列表。
    return viewMetaList;
}
/**
 * 异步获取指定表的指定视图的字段选项列表。
 * 
 * 本函数通过Bitable API获取指定表ID和视图ID对应的视图的字段元数据列表。
 * 这些元数据包括字段的名称、类型等信息，可用于构建前端界面的下拉选项或其他形式的字段选择器。
 * 
 * @param {string} tableId - 表的ID，用于唯一标识一个表。
 * @param {string} viewId - 视图的ID，用于唯一标识一个视图。视图是表的一种特定展示方式或筛选条件。
 * @returns {Promise<Array>} 返回一个Promise，解析为包含字段元数据的数组。每个字段元数据包括字段的各种属性，如名称、类型等。
 */
export const queryFieldMetaList = async (tableId: string, viewId: string, bitable = bitableSDK) => {
    const table = await bitable.base.getTableById(tableId)
    if (viewId === "allData")
        return await table.getFieldMetaList();
    else {
        const view = await table.getViewById(viewId);
        return await view.getFieldMetaList();
    }
}
/**
 * 获取视图中可见的记录Id列表
 * @param {string} tableId 
 * @param {string} viewId 
 * @return {}
 */
export const queryVisibleRecordList = async (tableId: string, viewId: string, bitable = bitableSDK) => {
    const table = await bitable.base.getTableById(tableId)
    if (viewId === "allData") {
        return await table.getRecordIdList()
    }
    const view = await table.getViewById(viewId);
    const list = await view.getVisibleRecordIdList()
    return list
}
// 拼接文本
function joinSegments(segments: IOpenSegment[]): string {
    return segments.map(segment => {
        if (segment.type === IOpenSegmentType.Url) {
            return segment.link;
        } else {
            return segment.text;
        }
    }).join('')
}
// 对于不同字段类型的处理方法
export const getAttachmentUrlMethods: Record<
    typeof CONSTANT.SUPPORT_FIELD_TYPE[number],
    (value: any, field: any, recordId: string) => Promise<string | string[]>
> = {
    [FieldType.Attachment]: async (_: IOpenAttachment[], field: IAttachmentField, recordId: string) => {
        const tempAttachmentList = await field.getAttachmentUrls(recordId);
        return tempAttachmentList
    },
    [FieldType.Url]: async (value: IOpenUrlSegment, _: IUrlField, __: string) => {
        const url = value.link
        return [url]
    },
    [FieldType.Text]: async (value: IOpenSegment[], _: ITextField, __: string) => {
        return [joinSegments(value)]
    }
}
/**
 * 获取附件值列表
 * @param {string} tableId 
 * @param {array} recordIdList 
 * @param {string} attachmentFieldId 
 * @param {number} length 限定的获取attachment的数量
 * @returns {array} 附件列表
 */
export const queryAttachmentList = async (
    tableId: string,
    recordIdList: string[],
    attachmentFieldId: string,
    length: number,
    fieldType: FieldType = FieldType.Attachment,
    bitable = bitableSDK
) => {
    const table = await bitable.base.getTableById(tableId)
    const attachmentField = await table.getFieldById(attachmentFieldId);

    const method = (fieldType in getAttachmentUrlMethods)
        ? getAttachmentUrlMethods[fieldType as keyof typeof getAttachmentUrlMethods]
        : getAttachmentUrlMethods[FieldType.Attachment]
    let attachmentList: string[] = []
    for (let recordId of recordIdList) {
        const value = await attachmentField.getValue(recordId)
        if (value === null)
            continue
        const tempAttachmentList = await method(value, attachmentField, recordId);
        attachmentList = attachmentList.concat(tempAttachmentList)
        if (attachmentList.length >= length) {
            attachmentList = attachmentList.slice(0, length); // 重新赋值
            break;
        }
    }
    return attachmentList
}