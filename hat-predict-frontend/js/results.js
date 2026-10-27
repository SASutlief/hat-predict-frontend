/* Shared results renderer. A future API can provide this same product schema. */
(function(root){
  'use strict';
  function ranked(products){
    if(!Array.isArray(products)||products.length===0)throw new Error('No predicted products.');
    const ids=new Set();
    return products.map(product=>{
      if(!product||typeof product.id!=='string'||!product.id||ids.has(product.id))throw new Error('Product identifiers must be unique.');
      ids.add(product.id);
      if(typeof product.delta_g_dagger_kcal_mol!=='number'||!Number.isFinite(product.delta_g_dagger_kcal_mol))throw new Error('Every product needs a finite ΔG‡ value.');
      if(typeof product.smiles!=='string'||!product.smiles)throw new Error('Missing product SMILES.');
      return {...product};
    }).sort((a,b)=>a.delta_g_dagger_kcal_mol-b.delta_g_dagger_kcal_mol||a.id.localeCompare(b.id,undefined,{numeric:true}));
  }
  function render(doc,dataset){
    const products=ranked(dataset.products);
    const body=doc.querySelector('#product-rows');body.replaceChildren();
    const cell=(row,text)=>{const td=doc.createElement('td');if(text!==undefined)td.textContent=text;row.append(td);return td;};
    let lastBarrier,rank=0;
    products.forEach((product,index)=>{
      const row=doc.createElement('tr');
      if(product.delta_g_dagger_kcal_mol!==lastBarrier)rank=index+1;
      lastBarrier=product.delta_g_dagger_kcal_mol;
      cell(row,String(rank));
      const picture=cell(row);
      // Only bundled, same-origin product drawings. Missing artwork never hides energies.
      if(typeof product.image==='string'&&/^assets\/products\/[a-zA-Z0-9_-]+\.svg$/.test(product.image)){
        const image=doc.createElement('img');image.src=product.image;image.alt=`${product.id}, radical product ${product.smiles}`;image.width=360;image.height=220;
        image.addEventListener('error',()=>{picture.textContent='Structure image unavailable. See product SMILES.';});picture.append(image);
      }else picture.textContent='Structure image unavailable. See product SMILES.';
      const identity=cell(row);const name=doc.createElement('strong');name.textContent=product.id;identity.append(name);
      const smiles=doc.createElement('code');smiles.textContent=product.smiles;identity.append(smiles);
      const value=cell(row,product.delta_g_dagger_kcal_mol.toFixed(2));value.className='barrier-value';
      body.append(row);
    });
    doc.querySelector('#results-reaction').textContent=dataset.title||'Predicted HAT products';
    doc.querySelector('#results-source').textContent=`${dataset.source||'Prediction source not specified'}. ${dataset.description||''}`;
    return products;
  }
  function toCSV(products){
    const rows=ranked(products);let previous,rank=0;
    const quoted=value=>'"'+String(value).replace(/"/g,'""')+'"';
    return 'rank,product,BR_smiles,DGdd_pred_kcal_mol\n'+rows.map((product,i)=>{
      if(product.delta_g_dagger_kcal_mol!==previous)rank=i+1;previous=product.delta_g_dagger_kcal_mol;
      return [rank,quoted(product.id),quoted(product.smiles),product.delta_g_dagger_kcal_mol.toFixed(2)].join(',');
    }).join('\n')+'\n';
  }
  const api={ranked,render,toCSV};
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.HATResults=api;
})(typeof globalThis!=='undefined'?globalThis:this);
