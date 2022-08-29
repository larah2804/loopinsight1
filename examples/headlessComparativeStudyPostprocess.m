clearvars

% import JSON file
simDataJson = fileread('headlessComparativeStudyResults.json');
% decode JSON file
simData = jsondecode(simDataJson);

%% prepare figure
clf(); set(gcf, 'Color', 'w', 'Position', [100 100 750 500]);
tiledlayout(2,1);
ax1 = nexttile(); set(ax1, 'NextPlot', 'add');
ax2 = nexttile(); set(ax2, 'NextPlot', 'add');


%% process data
dateFormat = '%4u-%2u-%2uT%2u:%2u:%fZ';
for i=1:length(simData)
    data = simData(i);
    
    if isstruct(data.results)
        % extract timestamps
%         timeFormat = 'yyyy-MM-dd''T''HH:mm:ss.SSS''Z''';
%         t = cellfun(@(s) datetime(s, 'InputFormat', timeFormat), {data.results.t});

        % faster alternative to extract timestamps
        t_ = sscanf([data.results.t], dateFormat);
        t = datetime(reshape(t_, 6, [])');
        x = struct2table([data.results.x]);
        u = struct2table([data.results.u]);
        y = struct2table([data.results.y]);
        
    elseif iscell(data.results)
        t = cellfun(@(s) datetime(sscanf(s.t, dateFormat)'), data.results);
        
        x = struct2table(cellfun(@(s) s.x, data.results, 'UniformOutput', true));
        u = struct2table(cellfun(@(s) s.u, data.results, 'UniformOutput', true));
        y = struct2table(cellfun(@(s) s.y, data.results, 'UniformOutput', true));
        
    end
    
    
    inputs = table2timetable(u, 'RowTimes', t);
    inputs.ibolus(inputs.ibolus==0) = NaN; % hide zero boluses in diagram
    results = table2timetable(x, 'RowTimes', t);
    outputs = table2timetable(y, 'RowTimes', t);
    
    h = plot(ax1, results.Time, outputs.G, 'DisplayName', data.id);
    stairs(ax2, results.Time, inputs.iir, 'Color', h.Color);
    plot(ax2, results.Time, inputs.ibolus, '^',  ...
        'MarkerEdgeColor', 'k', 'MarkerFaceColor', h.Color);
end

%% format graphs
axes(ax1); 
title('glucose concentration in mg/dL'); 
hold on; box on; grid on;
legend('show', 'Location', 'northwest')

axes(ax2); 
title('insulin infusion: basal rate in U/h and bolus in U'); 
hold on; box on; grid on;

%% store as file
print('headlessComparativeStudy.png', '-dpng', '-r300');