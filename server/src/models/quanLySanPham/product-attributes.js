function genPrefix(key) {
  switch (key.toLowerCase()) {
    case "xuatxu":
      return "XuatXu-"
    case "hedieuhanh":
      return "HeDieuHanh-"
    case "thuonghieu":
      return "ThuongHieu-"
    case "ram":
      return "Ram-"
    case "rom":
      return "Rom-"
    case "mausac":
      return "MauSac-"
  }
}

async function getAttributes(conn, attribute) {
  const table = attribute.toLowerCase()
  const prefix = genPrefix(table)
  try {
    console.log(attribute);
    const [result] = await conn.query(
      `SELECT *, CONCAT(?, ma${table}) AS ma
       FROM ${table}
       ORDER BY ma${table} DESC`,
      [prefix])
    return { Data: result, success: true }

  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }

}

async function insertAttribute(conn, attribute, data) {
  let result = [];
  try {
    switch (attribute.toLowerCase()) {
      case "xuatxu":
        await conn.query(
          `INSERT INTO xuatxu (tenxuatxu)
           VALUES ?`,
          [data.map(({ tenxuatxu }) => [tenxuatxu])]);

        [result] = await conn.query(
          `SELECT *
           FROM xuatxu
           WHERE tenxuatxu IN ?`,
          [[data.map(({ tenxuatxu }) => tenxuatxu)]]
        )
        break;
      case "hedieuhanh":
        await conn.query(
          `INSERT INTO hedieuhanh (tenhedieuhanh)
           VALUES ?`,
          [data.map(({ tenhedieuhanh }) => [tenhedieuhanh])]);

        [result] = await conn.query(
          `SELECT *
           FROM hedieuhanh
           WHERE tenhedieuhanh IN ?`,
          [[data.map(({ tenhedieuhanh }) => tenhedieuhanh)]])
        break;

      case "thuonghieu":
        await conn.query(
          `INSERT INTO thuonghieu (tenthuonghieu)
           VALUES ?`,
          [data.map(({ tenthuonghieu }) => [tenthuonghieu])]);

        [result] = await conn.query(
          `SELECT *
           FROM thuonghieu
           WHERE tenthuonghieu IN ?`,
          [[data.map(({ tenthuonghieu }) => tenthuonghieu)]])
        break;
      case "ram":
        await conn.query(
          `INSERT INTO ram (dungluongram)
           VALUES ?`,
          [data.map(({ dungluongram }) => [dungluongram])]);

        [result] = await conn.query(
          `SELECT *
           FROM ram
           WHERE dungluongram IN ?`,
          [[data.map(({ dungluongram }) => dungluongram)]])
        break;
      case "rom":
        await conn.query(
          `INSERT INTO rom (dungluongrom)
           VALUES ?`,
          [data.map(({ dungluongrom }) => [dungluongrom])]);

        [result] = await conn.query(
          `SELECT *
           FROM rom
           WHERE dungluongrom IN ?`,
          [[data.map(({ dungluongrom }) => dungluongrom)]])
        break;
      case "mausac":
        await conn.query(
          `INSERT INTO mausac (tenmausac)
           VALUES ?`,
          [data.map(({ tenmausac }) => [tenmausac])]);

        [result] = await conn.query(
          `SELECT *
           FROM mausac
           WHERE tenmausac IN ?`,
          [[data.map(({ tenmausac }) => tenmausac)]])
        break;

      default:
        return { error: "Add failed", success: false, Data: [] };
    }
  } catch (e) {
    console.log(e)
    return { error: "Add failed", success: false, Data: [] };
  }

  return { message: "Attribute added", success: true, Data: result };
}

async function updateAttribute(conn, attribute, data) {
  let result;
  try {
    switch (attribute.toLowerCase()) {
      case "xuatxu":
        [result] = await conn.query(
          `UPDATE xuatxu
           SET tenxuatxu = ?
           WHERE maxuatxu = ?;`, [data.tenxuatxu, data.maxuatxu])
        break;
      case "hedieuhanh":
        [result] = await conn.query(
          `UPDATE hedieuhanh
           SET tenhedieuhanh = ?
           WHERE mahedieuhanh = ?;`, [data.tenhedieuhanh, data.mahedieuhanh])
        break;
      case "thuonghieu":
        [result] = await conn.query(
          `UPDATE thuonghieu
           SET tenthuonghieu = ?
           WHERE mathuonghieu = ?;`, [data.tenthuonghieu, data.mathuonghieu])
        break;
      case "ram":
        [result] = await conn.query(
          `UPDATE ram
           SET dungluongram = ?
           WHERE maram = ?;`, [data.dungluongram, data.maram])
        break;
      case "rom":
        [result] = await conn.query(
          `UPDATE rom
           SET dungluongrom = ?
           WHERE marom = ?;`, [data.dungluongrom, data.marom])
        break;
      case "mausac":

        [result] = await conn.query(
          `UPDATE mausac
           SET tenmausac = ?
           WHERE mamausac = ?;`, [data.tenmausac, data.mamausac])
        break;

      default:
        return { error: "Update failed", success: false };
    }
  } catch (e) {
    console.log(e)
    return { error: "Update failed", success: false };
  }

  return { message: "Attribute updated", success: true };
}

async function deleteAttribute(conn, attribute, data) {
  let result;
  try {
    switch (attribute.toLowerCase()) {
      case "xuatxu":
        [result] = await conn.query(
          `DELETE
           FROM xuatxu
           WHERE maxuatxu IN ?;`,
          [[data.map(({ maxuatxu }) => maxuatxu)]])
        break;
      case "hedieuhanh":
        [result] = await conn.query(
          `DELETE
           FROM hedieuhanh
           WHERE mahedieuhanh IN ?;`,
          [[data.map(({ mahedieuhanh }) => mahedieuhanh)]])
        break;
      case "thuonghieu":
        [result] = await conn.query(
          `DELETE
           FROM thuonghieu
           WHERE mathuonghieu IN ?;`,
          [[data.map(({ mathuonghieu }) => mathuonghieu)]])
        break;
      case "ram":
        [result] = await conn.query(
          `DELETE
           FROM ram
           WHERE maram IN ?;`,
          [[data.map(({ maram }) => maram)]])
        break;
      case "rom":
        [result] = await conn.query(
          `DELETE
           FROM rom
           WHERE marom IN ?;`,
          [[data.map(({ marom }) => marom)]])
        break;
      case "mausac":
        [result] = await conn.query(
          `DELETE
           FROM mausac
           WHERE mamausac IN ?;`,
          [[data.map(({ mamausac }) => mamausac)]])
        break;

      default:
        return { error: "Delete failed", success: false };
    }
  } catch (e) {
    console.log(e)
    return { error: "Delete failed", success: false };
  }
  return { message: "Attribute deleted", success: true };
}

module.exports = { deleteAttribute, updateAttribute, getAttributes, insertAttribute }