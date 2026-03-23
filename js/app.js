document.addEventListener('DOMContentLoaded', () => {

    // 1. App State
    let appState = {
        theme: 'theme-classic',
        godIcon: 'om-ganesha',
        godText: '|| Shree Ganeshay Namah ||',
        photoData: null,
        sections: [
            {
                id: 'sec-personal',
                title: 'PERSONAL DETAILS',
                fields: [
                    { id: 'f1', label: 'Name', value: '' },
                    { id: 'f2', label: 'Date of Birth', value: '' },
                    { id: 'f3', label: 'Time of Birth', value: '' },
                    { id: 'f4', label: 'Place of Birth', value: '' },
                    { id: 'f5', label: 'Height', value: '' },
                    { id: 'f6', label: 'Religion/Caste', value: '' },
                    { id: 'f7', label: 'Gotra', value: '' },
                    { id: 'f8', label: 'Education', value: '' },
                    { id: 'f9', label: 'Occupation', value: '' },
                ]
            },
            {
                id: 'sec-family',
                title: 'FAMILY DETAILS',
                fields: [
                    { id: 'f10', label: "Father's Name", value: '' },
                    { id: 'f11', label: "Father's Occupation", value: '' },
                    { id: 'f12', label: "Mother's Name", value: '' },
                    { id: 'f13', label: "Mother's Occupation", value: '' },
                    { id: 'f14', label: 'Siblings', value: '' },
                ]
            },
            {
                id: 'sec-contact',
                title: 'CONTACT DETAILS',
                fields: [
                    { id: 'f15', label: 'Contact Number', value: '' },
                    { id: 'f16', label: 'Address', value: '' },
                ]
            }
        ]
    };

    const themes = [
        { id: 'theme-classic', name: 'Classic Red', bgClass: 'bg-classic' },
        { id: 'theme-elegant', name: 'Elegant Gold', bgClass: 'bg-elegant' },
        { id: 'theme-floral', name: 'Floral Bloom', bgClass: 'bg-floral' },
        { id: 'theme-royal-blue', name: 'Royal Blue', bgClass: 'bg-royal-blue' },
        { id: 'theme-rose-gold', name: 'Rose Gold', bgClass: 'bg-rose-gold' },
        { id: 'theme-minimal', name: 'Minimal Saffron', bgClass: 'bg-minimal' },
        { id: 'theme-ornate-gold', name: 'Ornate Gold Royal', bgClass: 'bg-ornate-gold' }
    ];

    const religionIcons = [
        { id: 'om-ganesha', label: 'Ganesha (Om)' },
        { id: 'om', label: 'Om' },
        { id: 'khanda', label: 'Khanda (Sikh)' },
        { id: 'crescent', label: 'Crescent (Muslim)' },
        { id: 'cross', label: 'Cross (Christian)' },
        { id: 'none', label: 'None' }
    ];

    const themeColors = {
        'theme-classic': '%23d32f2f',
        'theme-elegant': '%23b8860b',
        'theme-floral': '%23D81B60',
        'theme-royal-blue': '%231e3a8a',
        'theme-rose-gold': '%23b76e79',
        'theme-minimal': '%23e65100',
        'theme-ornate-gold': '%23b38b36'
    };

    const getIconSvg = (iconId, colorHex) => {
        if(iconId === 'none') return '';
        if(iconId === 'om-ganesha') {
            // We return a placeholder img and process it asynchronously to remove the background and colorize it
            setTimeout(() => processGaneshaImage(colorHex), 0);
            return `<img id="processed-ganesha" src="images/ganesha.png" alt="Ganesha" style="width:100%; height:100%; object-fit:contain; opacity: 0; transition: opacity 0.2s;">`;
        }
        if(iconId === 'om') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="70" font-size="60" text-anchor="middle" fill="${colorHex.replace('%23','#')}" font-family="sans-serif">ॐ</text></svg>`;
        if(iconId === 'khanda') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="70" font-size="60" text-anchor="middle" fill="${colorHex.replace('%23','#')}" font-family="sans-serif">☬</text></svg>`;
        if(iconId === 'crescent') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="70" font-size="60" text-anchor="middle" fill="${colorHex.replace('%23','#')}" font-family="sans-serif">☪</text></svg>`;
        if(iconId === 'cross') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="70" font-size="60" text-anchor="middle" fill="${colorHex.replace('%23','#')}" font-family="sans-serif">✝</text></svg>`;
        return '';
    };

    const processGaneshaImage = (targetHex) => {
        const img = new Image();
        // Since we downloaded it locally to 'images/ganesha.png'
        img.src = 'images/ganesha.png';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const targetColor = targetHex.replace('%23', '').replace('#', '');
            const rT = parseInt(targetColor.substring(0,2), 16);
            const gT = parseInt(targetColor.substring(2,4), 16);
            const bT = parseInt(targetColor.substring(4,6), 16);
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                // Make white/light background transparent
                if (r > 230 && g > 230 && b > 230) {
                    data[i + 3] = 0; 
                } else if (a > 0) {
                    // It's part of the image, colorize it matching the theme
                    data[i] = rT;
                    data[i + 1] = gT;
                    data[i + 2] = bT;
                    // Retain some alpha for anti-aliased edge smoothing
                    data[i + 3] = a; 
                }
            }
            ctx.putImageData(imageData, 0, 0);
            
            const processedEl = document.getElementById('processed-ganesha');
            if(processedEl) {
                processedEl.src = canvas.toDataURL('image/png');
                processedEl.style.opacity = '1';
            }
        };
    };

    // Helper: generate unique id
    const genId = () => 'f' + Math.random().toString(36).substr(2, 9);

    // 2. Render Functions

    function renderEditor() {
        // Theme Selector
        const themeContainer = document.getElementById('theme-selector-container');
        themeContainer.innerHTML = themes.map(t => `
            <label class="theme-option">
                <input type="radio" name="theme" value="${t.id}" ${appState.theme === t.id ? 'checked' : ''}>
                <span class="theme-preview ${t.bgClass}"></span>
                ${t.name}
            </label>
        `).join('');

        // Listeners for themes
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                appState.theme = e.target.value;
                applyThemeToPreview();
            });
        });

        // Builder Root
        const root = document.getElementById('builder-root');
        root.innerHTML = '';

        // Top Controls (God icon, text, photo)
        const topControlsHtml = `
            <div class="editor-top-controls">
                <div class="control-row">
                    <select id="select-god-icon" class="dynamic-input">
                        ${religionIcons.map(icon => `<option value="${icon.id}" ${appState.godIcon === icon.id ? 'selected' : ''}>${icon.label}</option>`).join('')}
                    </select>
                </div>
                <div class="control-row">
                    <input type="text" id="input-god-text" class="dynamic-input" style="flex:1;" value="${appState.godText}" placeholder="Top Heading...">
                </div>
                <div class="top-photo-area">
                    <label style="cursor:pointer; width:100%;">
                        <input type="file" id="upload-photo-btn" accept="image/*">
                        <div>📸 Click here to add your photo (Optional)</div>
                    </label>
                </div>
                ${appState.photoData ? `<button id="remove-photo-btn" class="btn btn-secondary btn-sm" style="margin-top:8px;">Remove Photo</button>`: ''}
            </div>
        `;
        root.insertAdjacentHTML('beforeend', topControlsHtml);

        // Sections
        appState.sections.forEach((sec, sIdx) => {
            const secHtml = `
                <div class="dynamic-section-container" style="margin: 24px;">
                    <div class="dynamic-section-header">
                        <input type="text" class="dynamic-section-title" data-sidx="${sIdx}" value="${sec.title}">
                    </div>
                    <div class="dynamic-section-fields" id="fields-${sIdx}">
                        ${sec.fields.map((field, fIdx) => `
                            <div class="dynamic-row">
                                <input type="text" class="dynamic-input dynamic-label-input" data-sidx="${sIdx}" data-fidx="${fIdx}" data-prop="label" value="${field.label}">
                                <input type="text" class="dynamic-input dynamic-value-input" data-sidx="${sIdx}" data-fidx="${fIdx}" data-prop="value" value="${field.value}">
                                <div class="dynamic-actions">
                                    <button class="btn-icon btn-up" data-sidx="${sIdx}" data-fidx="${fIdx}">▲</button>
                                    <button class="btn-icon btn-down" data-sidx="${sIdx}" data-fidx="${fIdx}">▼</button>
                                </div>
                                <button class="btn-icon btn-icon-danger btn-del" data-sidx="${sIdx}" data-fidx="${fIdx}">🗑️</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-field-btn" data-sidx="${sIdx}">+ Add New Field</button>
                </div>
            `;
            root.insertAdjacentHTML('beforeend', secHtml);
        });

        attachEditorListeners();
    }

    function attachEditorListeners() {
        // Top controls
        document.getElementById('select-god-icon').addEventListener('change', (e) => {
            appState.godIcon = e.target.value;
            renderPreview();
        });
        document.getElementById('input-god-text').addEventListener('input', (e) => {
            appState.godText = e.target.value;
            document.getElementById('preview-god-text').textContent = appState.godText;
        });

        // Photo Upload
        document.getElementById('upload-photo-btn').addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    appState.photoData = evt.target.result;
                    renderEditor();
                    renderPreview();
                };
                reader.readAsDataURL(file);
            }
        });
        const rmPhotoBtn = document.getElementById('remove-photo-btn');
        if(rmPhotoBtn) {
            rmPhotoBtn.addEventListener('click', () => {
                appState.photoData = null;
                renderEditor();
                renderPreview();
            });
        }

        // Section Titles
        document.querySelectorAll('.dynamic-section-title').forEach(input => {
            input.addEventListener('input', (e) => {
                const sIdx = e.target.getAttribute('data-sidx');
                appState.sections[sIdx].title = e.target.value;
            });
        });

        // Field Inputs
        document.querySelectorAll('.dynamic-label-input, .dynamic-value-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const sIdx = e.target.getAttribute('data-sidx');
                const fIdx = e.target.getAttribute('data-fidx');
                const prop = e.target.getAttribute('data-prop');
                appState.sections[sIdx].fields[fIdx][prop] = e.target.value;
            });
        });

        // Reorder & Delete
        document.querySelectorAll('.btn-up').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sIdx = parseInt(e.target.getAttribute('data-sidx'));
                const fIdx = parseInt(e.target.getAttribute('data-fidx'));
                if(fIdx > 0) {
                    const fields = appState.sections[sIdx].fields;
                    [fields[fIdx-1], fields[fIdx]] = [fields[fIdx], fields[fIdx-1]];
                    renderEditor();
                }
            });
        });
        document.querySelectorAll('.btn-down').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sIdx = parseInt(e.target.getAttribute('data-sidx'));
                const fIdx = parseInt(e.target.getAttribute('data-fidx'));
                const fields = appState.sections[sIdx].fields;
                if(fIdx < fields.length - 1) {
                    [fields[fIdx], fields[fIdx+1]] = [fields[fIdx+1], fields[fIdx]];
                    renderEditor();
                }
            });
        });
        document.querySelectorAll('.btn-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sIdx = parseInt(e.target.getAttribute('data-sidx'));
                const fIdx = parseInt(e.target.getAttribute('data-fidx'));
                appState.sections[sIdx].fields.splice(fIdx, 1);
                renderEditor();
            });
        });

        // Add
        document.querySelectorAll('.add-field-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sIdx = parseInt(e.target.getAttribute('data-sidx'));
                appState.sections[sIdx].fields.push({ id: genId(), label: 'New Field', value: '' });
                renderEditor();
            });
        });

        // Toggle sections visually
        document.querySelectorAll('.section-toggle').forEach(t => {
            // Remove old listener if re-rendered
            const cloned = t.cloneNode(true);
            t.parentNode.replaceChild(cloned, t);
            cloned.addEventListener('click', () => cloned.classList.toggle('active'));
        });
    }

    // 3. Render Preview
    function renderPreview() {
        // Theme
        applyThemeToPreview();

        // Top Header
        document.getElementById('preview-god-text').textContent = appState.godText;
        const iconDiv = document.getElementById('preview-god-icon');
        const colorHex = themeColors[appState.theme] || '%23000000';
        iconDiv.innerHTML = getIconSvg(appState.godIcon, colorHex);

        // Photo
        const photoCont = document.querySelector('.bio-photo-container');
        const photoImg = document.getElementById('preview-photo');
        if (appState.photoData) {
            photoImg.src = appState.photoData;
            photoCont.style.display = 'block';
        } else {
            photoCont.style.display = 'none';
        }

        // Title Name (search for 'Name' field anywhere)
        let nameVal = '';
        topLoop: for(let sec of appState.sections) {
            for(let f of sec.fields) {
                if(f.label.toLowerCase() === 'name') {
                    nameVal = f.value;
                    break topLoop;
                }
            }
        }
        document.getElementById('preview-title-name').textContent = nameVal || 'Your Name Here';

        // Sections
        const container = document.getElementById('preview-sections-container');
        container.innerHTML = '';

        appState.sections.forEach(sec => {
            // Only render if there's at least one field with a value
            const hasData = sec.fields.some(f => f.value.trim() !== '');
            if(!hasData) return;

            let html = `
                <div class="bio-section">
                    <h3>${sec.title}</h3>
                    <table class="bio-table">
                        <tbody>
                            ${sec.fields.filter(f => f.value.trim() !== '').map(f => `
                                <tr>
                                    <td class="label-cell">${f.label}</td>
                                    <td class="val-cell">${f.value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    function applyThemeToPreview() {
        const doc = document.getElementById('biodata-preview');
        doc.className = 'biodata-document ' + appState.theme;
    }

    // Export Logic
    document.getElementById('btn-download-pdf').addEventListener('click', () => {
        renderPreview();
        const element = document.getElementById('biodata-preview');
        const opt = {
            margin:       0,
            filename:     'biodata.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        const wrapper = document.querySelector('.preview-wrapper');
        const origTransform = wrapper.style.transform;
        wrapper.style.transform = 'none';
        html2pdf().set(opt).from(element).save().then(() => {
            wrapper.style.transform = origTransform;
        });
    });

    document.getElementById('btn-download-img').addEventListener('click', () => {
        renderPreview();
        const element = document.getElementById('biodata-preview');
        const wrapper = document.querySelector('.preview-wrapper');
        const origTransform = wrapper.style.transform;
        wrapper.style.transform = 'none';
        html2canvas(element, { scale: 2, useCORS: true, scrollY: 0 }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'biodata.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.98);
            link.click();
            wrapper.style.transform = origTransform;
        });
    });

    document.getElementById('btn-create-biodata').addEventListener('click', renderPreview);
    
    document.getElementById('btn-reset-form').addEventListener('click', () => {
        if(confirm("Are you sure you want to completely reset all fields?")) {
            location.reload();
        }
    });

    // Boot
    renderEditor();
    renderPreview();
});
