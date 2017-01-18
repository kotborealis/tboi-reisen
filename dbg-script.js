module.exports = (mod_var, production) => {
const _ = '_' + Math.random().toString(36).substring(2,6) + '_rs_dbg_';
return `
local ${_}log = {}
local ${_}size = 10
local ${_}x = 50
local ${_}y = 25
local ${_}offset = 10

function log(str)
	${production ? 'return' : ''}
	table.insert(${_}log, str)

	if #${_}log > ${_}size then
		table.remove(${_}log, 1)
	end
end

function ${_}render()
	local x = ${_}x
	local y = ${_}y
	for i = 1, #${_}log do
		Isaac.RenderText(${_}log[i], x, y, 255, 255, 255, 225)
		y = y + ${_}offset
	end
end
${production ? `${mod_var}:AddCallback(ModCallbacks.MC_POST_RENDER, ${_}render)` : ''}
`
}