/* UI only. Connect the future backend in submitPrediction(). */
(() => {
  const $ = selector => document.querySelector(selector);
  const sample = {a:'CC(C)([O-])c1ccccc1',b:'CCCC(C)C'};
  let mode='smiles', ready=false, loading=false;
  let exampleExport = null;
  const editors=['#editor-a','#editor-b'];
  const info = {
    about:'<h2>About HAT Predict</h2><p>A frontend prototype for a tool that estimates hydrogen atom transfer activation barriers.</p><p>Drawing and text inputs are interactive. No live predictions are calculated here. The saved one-site example comes from the local HAT Predict benchmark.</p><p>Scientific scope and validation information will be added with the backend.</p>',
    credits:'<h2>Credits</h2><p>HAT Predict model and original application: <a href="https://github.com/jacosand/hat-predict" target="_blank" rel="noopener">original repository</a>.</p><p>Structure editor: <a href="https://github.com/epam/ketcher" target="_blank" rel="noopener">EPAM Ketcher</a>.</p><p>Prototype frontend prepared for the Ken Houk Lab.</p><h3>HAT Predict authors</h3><p>Jacob N. Sanders<sup>1</sup>, Qingyang Zhou<sup>1</sup>, Qiankun Mo<sup>1</sup>, Fengjiao Liu<sup>2</sup>, Runze Liu<sup>1</sup>, Panpan Chen<sup>1</sup>, Meng Duan<sup>1</sup>, Xin Hong<sup>3</sup>, and K. N. Houk<sup>1</sup></p><h3>Affiliations</h3><p><sup>1</sup> Department of Chemistry and Biochemistry, University of California, Los Angeles, CA 90095, United States</p><p><sup>2</sup> School of Chemistry and Chemical Engineering, Shanghai University of Engineering Science, Shanghai 201620, China</p><p><sup>3</sup> Center of Chemistry for Frontier Technologies, Department of Chemistry, State Key Laboratory of Clean Energy Utilization, Zhejiang University, Hangzhou 310027, China</p>',
    licenses:'<h2>Licenses &amp; notices</h2><h3>Ketcher 3.18.0</h3><p>Copyright 2021 EPAM Systems. Ketcher is distributed under the Apache License, Version 2.0.</p><p><a href="KETCHER_LICENSE.txt" target="_blank" rel="noopener">Read the included Apache 2.0 license</a> · <a href="https://github.com/epam/ketcher" target="_blank" rel="noopener">Ketcher source</a></p><h3>Third-party dependencies</h3><p>The bundled editor includes software from other projects. Their copyright and license notices are retained with the distributed files.</p><p><a href="ketcher/static/js/main.e47c48ad.js.LICENSE.txt" target="_blank" rel="noopener">Main editor notices</a> · <a href="THIRD_PARTY.md" target="_blank" rel="noopener">All bundled notice files</a></p><h3>HAT Predict</h3><p>This frontend prototype does not distribute the HAT Predict model or Python backend. Attribution appears in Credits; third-party component licenses do not grant a license to the model or the entire website.</p>'
  };
  document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    $('#dialog-content').innerHTML=info[button.dataset.dialog];$('#info').showModal();
  }));
  $('#close-dialog').addEventListener('click',()=>$('#info').close());
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    mode=button.dataset.mode;$('#home').hidden=true;$('#workspace').hidden=false;
    $('#results').hidden=true;$('#message').textContent='';$('#xyz-pane').hidden=mode!=='xyz';
    $('#reaction-pane').hidden=mode==='xyz';$('#load-example').hidden=mode==='xyz';
    $('#mode-title').textContent={smiles:'Enter your structures.',draw:'Draw your reaction.',xyz:'Explore structure uploads.'}[mode];
    document.querySelectorAll('.editor-wrap').forEach(el=>el.hidden=mode!=='draw');
    document.querySelectorAll('.smiles-entry').forEach(el=>el.hidden=mode!=='smiles');
    $('#editor-status').textContent='';
    if(mode==='draw')loadEditors();
    $('#mode-title').tabIndex=-1;$('#mode-title').focus();
  }));
  $('.back').addEventListener('click',()=>{$('#workspace').hidden=true;$('#home').hidden=false;});
  async function loadEditors(){
    if(ready){$('#editor-status').textContent='Ketcher is ready. Your drawings are exported automatically when you submit.';return;}
    if(loading)return;loading=true;$('#editor-status').textContent='Loading the structure editors…';
    try {
      const response=await fetch('ketcher/index.html');
      if(!response.ok)throw new Error('missing');
      editors.forEach(id=>{$(id).src='ketcher/index.html';});
      await Promise.all(editors.map(id=>new Promise((resolve,reject)=>{
        let tries=0;const timer=setInterval(()=>{try{
          if($(id).contentWindow.ketcher){clearInterval(timer);resolve();}
          else if(++tries>120){clearInterval(timer);reject(new Error('timeout'));}
        }catch(error){clearInterval(timer);reject(error);}},500);
      })));
      ready=true;$('#editor-status').textContent='Ketcher is ready.';
    } catch(error){$('#editor-status').textContent='Ketcher is not installed yet. Follow README.md to copy your working Ketcher folder. Select the SMILES input method to enter text instead.';}
    finally{loading=false;}
  }
  async function loadExample(){
    $('#smiles-a').value=sample.a;$('#smiles-b').value=sample.b;$('#message').textContent='Example loaded. Select “View example result” to see its saved prediction.';
    if(mode==='draw'){
      await loadEditors();
      if(ready){
        await Promise.all(editors.map((id,i)=>$(id).contentWindow.ketcher.setMolecule(i===0?sample.a:sample.b)));
        exampleExport=await Promise.all(editors.map(id=>$(id).contentWindow.ketcher.getSmiles()));
      }
    }
  }
  $('#load-example').addEventListener('click',()=>loadExample().catch(()=>{$('#message').textContent='The editor could not load the example. Use the SMILES fields.';}));
  async function submitPrediction(){
    $('#results').hidden=true;
    if(mode==='draw'&&!ready){$('#message').textContent='Wait for both drawing editors to load, or return and choose SMILES.';return;}
    if(mode==='draw'&&ready){
      const values=await Promise.all(editors.map(id=>$(id).contentWindow.ketcher.getSmiles()));
      $('#smiles-a').value=values[0].trim();$('#smiles-b').value=values[1].trim();
    }
    const a=$('#smiles-a').value.trim(),b=$('#smiles-b').value.trim();
    if(!a||!b){$('#message').textContent='Please provide both structures, or load the example.';return;}
    // Exact matching intentionally avoids assigning saved results to new molecules.
    const originalExample = a===sample.a && b===sample.b;
    const editorExample = exampleExport && a===exampleExport[0].trim() && b===exampleExport[1].trim();
    if(!originalExample && !editorExample){$('#message').textContent='Your structures have been entered. This prototype cannot calculate new predictions. Load the example to view a saved result.';return;}
    $('#message').textContent='Displaying the saved benchmark result. No model calculation was run.';
    $('#results').hidden=false;$('#results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  }
  $('#submit').addEventListener('click',async()=>{
    $('#submit').disabled=true;
    try{await submitPrediction();}catch(error){$('#message').textContent='Could not export the drawing. Try entering SMILES directly.';}finally{$('#submit').disabled=false;}
  });
  $('#download').addEventListener('click',()=>{
    const csv='AR_smiles,AH_smiles,BR_smiles,BH_smiles,DGdd_pred\n"CC(C)([O])c1ccccc1","CC(C)(O)c1ccccc1","[CH2]CCC(C)C","CCCC(C)C",17.62\n';
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='hat-predict-saved-example.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  // Basic XYZ parsing and atom-only 2D projection; no bonding is inferred.
  const xyzFiles = {a:null,b:null};
  function preview(canvas, atoms){
    const context=canvas.getContext('2d');context.clearRect(0,0,canvas.width,canvas.height);
    const xs=atoms.map(a=>a.x),ys=atoms.map(a=>a.y);
    const xmin=Math.min(...xs),ymin=Math.min(...ys);
    const scale=Math.min(340/(Math.max(...xs)-xmin||1),180/(Math.max(...ys)-ymin||1));
    context.fillStyle='#f7faf8';context.fillRect(0,0,canvas.width,canvas.height);
    const colors={C:'#647372',H:'#d7e0de',N:'#78a9dd',O:'#df877b',F:'#99cbb2',S:'#d9be64'};
    atoms.forEach((atom,index)=>{
      const x=50+(atom.x-xmin)*scale,y=40+(atom.y-ymin)*scale;
      context.beginPath();context.arc(x,y,atom.element==='H'?5:8,0,2*Math.PI);
      context.fillStyle=colors[atom.element]||'#bc9cd4';context.fill();
      context.fillStyle='#253536';context.font='11px system-ui';context.fillText(`${index+1}: ${atom.element}`,x+10,y+4);
    });
    context.fillStyle='#647372';context.fillText('XY projection · numbered atoms · no bonds inferred',12,canvas.height-12);
  }
  for(const key of ['a','b']){
    const input=$(`#xyz-${key}`),status=$(`#xyz-${key}-status`),canvas=$(`#xyz-${key}-preview`);
    function reset(){
      xyzFiles[key]=null;canvas.hidden=true;$(`#xyz-${key}-remove`).hidden=true;
      $(`#xyz-${key}-details`).hidden=true;$(`#xyz-${key}-choose`).textContent='Choose an .xyz file';
      $(`#xyz-${key}-charge`).value='0';
      if(key==='a')$('#xyz-a-site').value='';
      else{$('#xyz-b-site').value='all';$('#xyz-b-atom').value='';$('#xyz-b-atom').disabled=true;}
    }
    input.addEventListener('change',async()=>{
      const file=input.files[0];if(!file)return;reset();
      if(file.size>1024*1024){status.textContent='Choose a file smaller than 1 MB.';input.value='';return;}
      try{
        const lines=(await file.text()).replace(/\r/g,'').split('\n');
        const n=Number(lines[0].trim());
        if(!Number.isInteger(n)||n<1||n>1000)throw new Error('Invalid atom count (expected 1–1000).');
        const rows=lines.slice(2,2+n);
        if(rows.length!==n)throw new Error('The file contains fewer atom rows than declared.');
        const atoms=rows.map(line=>{
          const p=line.trim().split(/\s+/);
          if(p.length<4||! /^[A-Z][a-z]?$/.test(p[0])||!p.slice(1,4).every(v=>Number.isFinite(Number(v))))throw new Error('Expected an element symbol and three coordinates per atom.');
          return {element:p[0],x:Number(p[1]),y:Number(p[2]),z:Number(p[3])};
        });
        if(lines.slice(2+n).some(line=>line.trim()))throw new Error('Use a single-frame XYZ file, not a trajectory.');
        xyzFiles[key]={name:file.name,atoms};preview(canvas,atoms);canvas.hidden=false;
        status.textContent=`${file.name} · ${n} atoms · read locally; nothing uploaded.`;
        $(`#xyz-${key}-remove`).hidden=false;$(`#xyz-${key}-details`).hidden=false;
        $(`#xyz-${key}-choose`).textContent='Replace .xyz file';
        $(key==='a'?'#xyz-a-site':'#xyz-b-atom').max=n;
      }catch(error){status.textContent=error.message;input.value='';}
    });
    $(`#xyz-${key}-remove`).addEventListener('click',()=>{reset();input.value='';status.textContent='File removed.';});
  }
  $('#xyz-b-site').addEventListener('change',()=>{$('#xyz-b-atom').disabled=$('#xyz-b-site').value!=='selected';});
})();
