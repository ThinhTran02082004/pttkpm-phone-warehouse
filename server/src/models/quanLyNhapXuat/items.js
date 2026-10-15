const conn = require("express");

async function getItems(conn) {
  try {
    const [result] = await conn.query(
      `SELECT *
       FROM sanpham
       ORDER BY masanpham DESC`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function getItemsFromConfiguresAndState(conn, {madanhmucsanpham, macauhinh, matinhtrang}) {
  try {
    let result;
    if (macauhinh === '*' && matinhtrang === '*')
      [result] = await conn.query(
        `SELECT s.maimei, s.phieunhap, s.phieuxuat, t.tenhienthi tentinhtrang
         FROM sanpham s
                  INNER JOIN ptpm.cauhinh c ON s.cauhinh = c.macauhinh
                  INNER JOIN ptpm.tinhtrang t ON s.tinhtrang = t.matinhtrang
                  INNER JOIN danhmucsanpham d ON d.madanhmucsanpham = c.danhmucsanpham
         WHERE d.madanhmucsanpham = ?
         ORDER BY masanpham DESC;`,
        [madanhmucsanpham])

    else if (macauhinh === '*' && matinhtrang !== '*')
      [result] = await conn.query(
        `SELECT s.maimei, s.phieunhap, s.phieuxuat, t.tenhienthi tentinhtrang
         FROM sanpham s
                  INNER JOIN ptpm.cauhinh c ON s.cauhinh = c.macauhinh
                  INNER JOIN ptpm.tinhtrang t ON s.tinhtrang = t.matinhtrang
                  INNER JOIN danhmucsanpham d ON d.madanhmucsanpham = c.danhmucsanpham
         WHERE d.madanhmucsanpham = ?
           AND t.matinhtrang = ?
         ORDER BY masanpham DESC;`,
        [madanhmucsanpham, matinhtrang])

    else if (macauhinh !== '*' && matinhtrang === '*')
      [result] = await conn.query(
        `SELECT s.maimei, s.phieunhap, s.phieuxuat, t.tenhienthi tentinhtrang
         FROM sanpham s
                  INNER JOIN ptpm.cauhinh c ON s.cauhinh = c.macauhinh
                  INNER JOIN ptpm.tinhtrang t ON s.tinhtrang = t.matinhtrang
                  INNER JOIN danhmucsanpham d ON d.madanhmucsanpham = c.danhmucsanpham
         WHERE d.madanhmucsanpham = ?
           AND c.macauhinh = ?
         ORDER BY masanpham DESC;`,
        [madanhmucsanpham, macauhinh])

    else if (macauhinh !== '*' && matinhtrang !== '*')
      [result] = await conn.query(
        `SELECT s.maimei, s.phieunhap, s.phieuxuat, t.tenhienthi tentinhtrang
         FROM sanpham s
                  INNER JOIN ptpm.cauhinh c ON s.cauhinh = c.macauhinh
                  INNER JOIN ptpm.tinhtrang t ON s.tinhtrang = t.matinhtrang
                  INNER JOIN danhmucsanpham d ON d.madanhmucsanpham = c.danhmucsanpham
         WHERE d.madanhmucsanpham = ?
           AND macauhinh = ?
           AND t.matinhtrang = ?
         ORDER BY masanpham DESC;`,
        [madanhmucsanpham, macauhinh, matinhtrang])

    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function getTinhTrang(conn) {
  try {
    const [result] = await conn.query(
      `SELECT *
       FROM tinhtrang
       WHERE matinhtrang != 5
       ORDER BY matinhtrang DESC`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}


async function insertItem(conn, Data = []) {
  try {
    await conn.query(
      `INSERT INTO sanpham (maimei, cauhinh, phieunhap, phieuxuat, tinhtrang)
       VALUES ?`,
      [Data.map(({maimei, cauhinh, phieunhap, phieuxuat, tinhtrang}) =>
        [maimei, cauhinh, phieunhap, phieuxuat, tinhtrang]
      )])

    const [result] = await conn.query(
      `SELECT *
       FROM sanpham
       WHERE maimei IN ?`,
      [[Data.map(({maimei}) => maimei)]])
    return {message: "Items added", success: true, Data: result};
  } catch (e) {
    console.log(e)
    return {message: "Added fail", success: false, Data: []};
  }
}

async function updateItem(conn, {maimei, cauhinh, phieunhap, phieuxuat, tinhtrang, masanpham}) {
  try {
    await conn.query(
      `UPDATE sanpham
       SET maimei    = ?,
           cauhinh   = ?,
           phieunhap = ?,
           phieuxuat = ?,
           tinhtrang = ?
       WHERE masanpham = ?`,
      [maimei, cauhinh, phieunhap, phieuxuat, tinhtrang, masanpham])
    return {message: "Item updated", success: true}
  } catch (e) {
    console.log((e))
    return {message: "Updated fail", success: false};
  }
}

async function deleteItem(conn, Data = []) {
  try {
    await conn.query(
      `DELETE
       FROM sanpham
       WHERE masanpham IN ?`,
      [[Data.map(({masanpham}) => masanpham)]])
    return {message: "Item deleted", success: true}
  } catch (e) {
    return {message: "Deleted fail", success: false}
  }
}

async function updateItemOrder(conn, Data = []) {
  try {
    await Promise.all(Data.map(({cauhinh, soluong, phieuxuat}) => conn.query(
      `UPDATE sanpham
       SET phieuxuat = ?
       WHERE masanpham IN
             (SELECT *
              FROM (SELECT masanpham
                    FROM sanpham
                    WHERE phieuxuat IS NULL
                      AND cauhinh = ?
                    LIMIT ?) a);`,
      [phieuxuat, cauhinh, soluong]).then(i => i[0])))
    // console.log(result)
    return {success: true}
  } catch (e) {
    console.log(e)
    return {success: false}
  }
}

module.exports = {
  deleteItem, updateItem, getItems, insertItem, getTinhTrang, getItemsFromConfiguresAndState, updateItemOrder
}